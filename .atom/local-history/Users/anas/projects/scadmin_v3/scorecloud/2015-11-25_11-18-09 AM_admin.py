from django.contrib                  import admin
from scorecloud.models               import *
from django.forms                    import ModelForm, CharField
from django.forms                    import widgets
from django.utils.safestring         import mark_safe
from django.contrib.admin            import DateFieldListFilter, SimpleListFilter
from django.conf                     import settings
from django.contrib.admin.models     import LogEntry, DELETION
from django.contrib.admin.options    import IncorrectLookupParameters
from django.contrib.admin.views.main import ChangeList
from django.core.paginator           import InvalidPage, Paginator
from django.db                       import connection

class BaseModelAdmin(admin.ModelAdmin):
    def has_add_permission(self, request, obj = None):
        return False

    def has_delete_permission(self, request, obj = None):
        return False

    if settings.DEBUG:
        list_per_page = 50
        show_full_result_count = False

class DirectLinkWidget(widgets.TextInput):
    def render(self, name, value, attrs = None):
        if value:
            return mark_safe( value )
        else:
            return ''




class LargeTableChangeList(ChangeList):
    """
    Overrides the count method to get an estimate instead of actual count when not filtered.

    The only change is the try/catch block calculating 'full_result_count'
    """
    def __init__(self, *args, **kwargs):
        super(LargeTableChangeList, self).__init__(*args, **kwargs)
        if django.VERSION < (1, 4):
            from django.contrib.admin.views.main import MAX_SHOW_ALL_ALLOWED
            self.list_max_show_all = MAX_SHOW_ALL_ALLOWED

    def get_results(self, request):
        paginator = self.model_admin.get_paginator(request, self.query_set, self.list_per_page)
        # Get the number of objects, with admin filters applied.
        result_count = paginator.count

        # Get the total number of objects, with no admin filters applied.
        # Perform a slight optimization: Check to see whether any filters were
        # given. If not, use paginator.hits to calculate the number of objects,
        # because we've already done paginator.hits and the value is cached.
        if not self.query_set.query.where:
            full_result_count = result_count
        else:
            try:
                cursor = connection.cursor()
                cursor.execute("SELECT reltuples FROM pg_class WHERE relname = %s",
                    [self.root_query_set.query.model._meta.db_table])
                full_result_count = int(cursor.fetchone()[0])
            except:
                full_result_count = self.root_query_set.count()

        can_show_all = result_count <= self.list_max_show_all
        multi_page = result_count > self.list_per_page

        # Get the list of objects to display on this page.
        if (self.show_all and can_show_all) or not multi_page:
            result_list = self.query_set._clone()
        else:
            try:
                result_list = paginator.page(self.page_num + 1).object_list
            except InvalidPage:
                raise IncorrectLookupParameters

        self.result_count = result_count
        self.full_result_count = full_result_count
        self.result_list = result_list
        self.can_show_all = can_show_all
        self.multi_page = multi_page
        self.paginator = paginator
        self.query_set = query_set

class LargeTablePaginator(Paginator):
    """
    Overrides the count method to get an estimate instead of actual count when not filtered
    """
    def _get_count(self):
        """
        Changed to use an estimate if the estimate is greater than 10,000
        Returns the total number of objects, across all pages.
        """
        if self._count is None:
            try:
                estimate = 0
                if not self.object_list.query.where:
                    try:
                        cursor = connection.cursor()
                        cursor.execute("SELECT reltuples FROM pg_class WHERE relname = %s",
                            [self.object_list.query.model._meta.db_table])
                        estimate = int(cursor.fetchone()[0])
                    except:
                        pass
                if estimate < 10000:
                    self._count = self.object_list.count()
                else:
                    self._count = estimate
            except (AttributeError, TypeError):
                # AttributeError if object_list has no count() method.
                # TypeError if object_list.count() requires arguments
                # (i.e. is of type list).
                self._count = len(self.object_list)
        return self._count
    count = property(_get_count)

'''
User Admin
'''
def get_song_author_link(user):
    return '<a target="_blank" href="%s%s">%s</a>' % ('/admin/scorecloud/song/?author__user_id__exact=', user.user_id, user.username or 'UserName')
def get_user_info_link(user):
    return '<a target="_blank" href="%s%s">%s</a>' % ('/admin/scorecloud/userinfo/', user.user_id, user.user_id)
def get_admin_songs_link(user):
    return '<a target="_blank" href="%s%s">%s</a>' % ('https://my.scorecloud.com/admin-songs/', user.username or user.user_id, 'SC')
def get_user_Subscription_Status_link(user):
    return '<a target="_blank" href="%s%s">%s</a>' % ('/admin/scorecloud/usersubscriptionstatus/?user__user_id__exact=', user.user_id, user.username or 'UserName')

class UserForm(ModelForm):
    user_songs               = CharField(widget = DirectLinkWidget, required = False)
    admin_songs              = CharField(widget = DirectLinkWidget, required = False)
    user_Subscription_Status = CharField(widget = DirectLinkWidget, required = False)

    def __init__(self, *args, **kwargs):
        super(UserForm, self).__init__(*args, **kwargs)
        self.set_initial_values()

    def set_initial_values(self):
        self.fields['user_songs'].initial               = get_song_author_link(self.instance)
        self.fields['admin_songs'].initial              = get_admin_songs_link(self.instance)
        self.fields['user_Subscription_Status'].initial = get_user_Subscription_Status_link(self.instance)

    class Meta:
        model  = UserInfo
        fields = ('user_id', 'username', 'email', 'user_type', 'user_count', 'registration_date', 'facebook_id', 'collection', 'registration_app' , 'pre_subscription_registration', 'ip' , 'description', 'country' , 'location', 'tagline', 'display_name',)

class UserAdmin(BaseModelAdmin):
    class Media:
        css = {
             'all': ('css/admin/my_own_admin.css',)
        }
    form            = UserForm
    list_display    = ('user_id', 'username', 'email', 'user_type', 'registration_date', 'country' , 'location', 'display_name',)
    list_filter     = ("country",('registration_date', DateFieldListFilter),)
    search_fields   = ("username", 'user_id', 'email',)
    ordering        = ('-registration_date',)
    readonly_fields = ('user_id', 'registration_date', 'user_count', 'collection', 'registration_app', 'ip' , 'pre_subscription_registration',)

admin.site.register(UserInfo, UserAdmin)

'''
Songs Admin
'''
def get_song_link(song):
    return '<a target="_blank" href="%s%s">%s</a>' % ('http://my.scorecloud.com/song/', song.song_id, 'SC')

def get_song_meta_link(song):
    return '<a target="blank" href="%s%s">%s</a>' %('/admin/scorecloud/songmeta/',song.song_id, 'See song embed and description! [ if there is any :) ]')

def get_song_counters_link(song):
    return '<a target="_blank" href="%s%s">%s</a>' % ('/admin/scorecloud/objectcounters/?q=',song.song_id, 'Get Song\'s counters')

class LinkWidget(widgets.TextInput):
    def render(self, name, value, attrs=None):
        if value:
            return mark_safe('<a href=' + value + '>' + value + '</a>')
        else:
            return ''

class SongForm(ModelForm):
    cuex                   = CharField(widget = LinkWidget, required       = False)
    scld                   = CharField(widget = LinkWidget, required       = False)
    midi                   = CharField(widget = LinkWidget, required       = False)
    playback_mp3           = CharField(widget = LinkWidget, required       = False)
    recording_ogg          = CharField(widget = LinkWidget, required       = False)
    recording_mp3          = CharField(widget = LinkWidget, required       = False)
    author_songs           = CharField(widget = DirectLinkWidget, required = False)
    song_Embed_Description = CharField(widget = DirectLinkWidget, required = False)
    user_info              = CharField(widget = DirectLinkWidget, required = False)
    song_counters          = CharField(widget = DirectLinkWidget, required = False)

    def __init__(self, *args, **kwargs):
        super(SongForm, self).__init__(*args, **kwargs)
        self.set_initial_values()

    def set_initial_values(self):
        api_base_url = "https://my.scorecloud.com/api/2.0/song/"

        if self.instance.source_type == "recording":
            self.fields['recording_ogg'].initial = api_base_url + self.instance.song_id + "/recording.ogg"
            self.fields['recording_mp3'].initial = api_base_url + self.instance.song_id + "/recording.mp3"

        self.fields['cuex'].initial                   = api_base_url + self.instance.song_id + "/cuex"
        self.fields['scld'].initial                   = api_base_url + self.instance.song_id + "/song.scld"
        self.fields['midi'].initial                   = api_base_url + self.instance.song_id + "/playback.midi"
        self.fields['playback_mp3'].initial           = api_base_url + self.instance.song_id + "/playback.mp3"
        self.fields['author_songs'].initial           = get_song_author_link(self.instance.author)
        self.fields['song_Embed_Description'].initial = get_song_meta_link(self.instance)
        self.fields['user_info'].initial              = get_user_info_link(self.instance.author)
        self.fields['song_counters'].initial          = get_song_counters_link(self.instance)

    class Meta:
        model  = Song
        fields = ('song_id', 'source_type' , 'title' , 'creation_date', 'is_active', 'is_shared' , 'is_deleted' , 'song_Embed_Description' , 'is_unsorted', 'current_scld_id' , 'meta' , 'current_revision_id' , 'last_update' , 'permissions', 'is_public', 'popularity', 'maturity', )

class PermissionsFilter(SimpleListFilter):
    title          = 'permissions'
    parameter_name = 'permissions'

    def lookups(self, request, model_admin):
        return (
            ('True', True),
        )

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(permissions__isnull=False)
        else:
            return queryset

class SongsAdmin(BaseModelAdmin):
    form      = SongForm
    paginator = LargeTablePaginator

    def get_changelist(self, request, **kwargs):
        return LargeTableChangeList

    def author_link(self, obj):
        return get_song_author_link(obj.author)

    def sc_song_link(self, obj):
        return get_song_link(obj)

    def permission_field(self, obj):
        if obj.permissions:
            return True
        else:
            return ''

    author_link.allow_tags             = True
    author_link.short_description      = 'Author'
    sc_song_link.allow_tags            = True
    sc_song_link.short_description     = 'SC'
    permission_field.short_description = 'Permissions'
    ordering                           = ('-creation_date',)
    list_display                       = ('song_id', 'sc_song_link', 'author_link' , 'title' , 'creation_date', 'is_deleted', 'is_public', 'popularity', 'maturity',)
    list_filter                        = ('popularity', 'maturity', 'source_type', 'is_active', 'is_shared', 'is_public', 'is_deleted', PermissionsFilter,('creation_date', DateFieldListFilter),)
    search_fields                      = ("title","song_id",)
    readonly_fields                    = ('song_id' , 'source_type', 'creation_date', 'is_shared', 'is_unsorted', 'current_scld_id', 'meta', 'current_revision_id', 'last_update', 'permissions', 'is_public', 'popularity', 'maturity',)

admin.site.register(Song, SongsAdmin)

'''
SongMeta Admin
'''
class SongMetaAdmin(BaseModelAdmin):
    list_display    =('song', 'description', 'embed')
    search_fields   = ("song__song_id",)
    readonly_fields =('song',)

admin.site.register(SongMeta, SongMetaAdmin)

'''
UserSubscriptionStatus Admin
'''
class UserSubscriptionStatusAdmin(BaseModelAdmin):
    list_display    = ('user', 'subscription_name', 'expiry_date', 'date_created', 'is_trial', 'is_cancelled', 'billing_cycle', 'provider',)
    list_filter     = (('date_created', DateFieldListFilter), 'provider', 'subscription_name',('expiry_date', DateFieldListFilter),)
    search_fields   = ("user__username",)
    ordering        = ('-date_created',)
    readonly_fields = ('user', 'subscription_name', 'expiry_date', 'date_created', 'is_trial', 'is_cancelled', 'billing_cycle', 'provider',)

admin.site.register(UserSubscriptionStatus, UserSubscriptionStatusAdmin)

'''
VoucherCode Admin
'''
class VoucherCodeAdmin(admin.ModelAdmin):
    list_display    = ('voucher_code', 'plan_name', 'user', 'months_active', 'end_date', 'claimable_until', 'claimed_date', 'date_created', 'comment',)
    list_filter     = (('date_created', DateFieldListFilter), 'plan_name',('claimable_until', DateFieldListFilter),('end_date', DateFieldListFilter),)
    search_fields   = ("user__username", 'voucher_code', 'comment',)
    ordering        = ('-date_created',)
    readonly_fields = ('user',)

admin.site.register(VoucherCode, VoucherCodeAdmin)

'''
ObjectCounters Admin
'''
class ObjectCounterAdmin(BaseModelAdmin):
    list_display    =('object_type', 'object_id', 'comment_count', 'like_count', 'bookmark_count', 'view_count', 'play_count', 'creation_date',)
    search_fields   = ("object_id",)
    ordering        = ('-creation_date',)
    readonly_fields =('object_type', 'object_id', 'comment_count', 'like_count', 'bookmark_count', 'view_count', 'play_count', 'creation_date',)

admin.site.register(ObjectCounters, ObjectCounterAdmin)

'''
likes Admin
'''
class LikeAdmin(BaseModelAdmin):
    list_display    = ('like_id', 'user', 'object_type', 'object_id', 'date_created',)
    list_filter     = (('date_created', DateFieldListFilter),)
    search_fields   = ("user__username",)
    ordering        = ('-date_created',)
    readonly_fields = ('like_id', 'user', 'object_type', 'object_id', 'date_created',)

admin.site.register(Likes, LikeAdmin)

'''
Comment Admin
'''
class CommentAdmin(BaseModelAdmin):
    list_display    =('object_id', 'user', 'text', 'creation_date', 'comment_id', 'object_type_id',)
    list_filter     = (('creation_date', DateFieldListFilter),)
    search_fields   = ("user__username", 'text',)
    ordering        = ('-creation_date',)
    readonly_fields = ('object_id', 'user', 'creation_date', 'comment_id', 'object_type_id',)

admin.site.register(Comment, CommentAdmin)

'''
Bookmark Admin
'''
class BookmarkAdmin(BaseModelAdmin):
    list_display    =('bookmark_id', 'user', 'object_type', 'object_id', 'date_created',)
    list_filter     = (('date_created', DateFieldListFilter),)
    search_fields   = ("user__username",)
    ordering        = ('-date_created',)
    readonly_fields = ('bookmark_id', 'user', 'object_type', 'object_id', 'date_created',)

admin.site.register(Bookmark, BookmarkAdmin)

'''
SongCollection Admin
'''
class SongCollectionAdmin(BaseModelAdmin):
    list_display    =('collection_id', 'owner_id', 'collection_type' , 'collection_name', 'creation_date',)
    list_filter     = (('creation_date', DateFieldListFilter),)
    search_fields   = ('collection_name', 'collection_id',)
    ordering        = ('-creation_date',)
    readonly_fields = ('collection_id', 'owner_id', 'collection_type' , 'collection_name', 'folder_view', 'creation_date', 'permissions',)

admin.site.register(SongCollection, SongCollectionAdmin)
