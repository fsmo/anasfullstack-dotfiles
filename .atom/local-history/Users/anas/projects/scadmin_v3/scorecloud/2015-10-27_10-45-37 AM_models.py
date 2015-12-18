# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin sqlcustom [app_label]'
# into your database.
from __future__ import unicode_literals

from django.db import models
from jsonfield import JSONField

class Action(models.Model):
    action_id = models.AutoField(primary_key=True)
    user = models.TextField(blank=False, null=False)
    recipient = models.ForeignKey('UserInfo', blank=True, null=True)
    object_id = models.CharField(max_length=255)
    object_type = models.ForeignKey('ObjectType')
    date_created = models.DateTimeField()
    viewed_by_recipient = models.BooleanField()
    action_type = models.ForeignKey('ActionType')
    handled = models.NullBooleanField()

    class Meta:
        managed = False
        db_table = 'action'


class ActionType(models.Model):
    action_type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'action_type'


class App(models.Model):
    app_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'app'


class AppleTransaction(models.Model):
    user = models.ForeignKey('UserInfo', blank=True, null=True)
    transaction_id = models.TextField(blank=True, null=True)
    original_transaction_id = models.TextField(blank=True, null=True)
    product_id = models.TextField(blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'apple_transaction'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup)
    permission = models.ForeignKey('AuthPermission')

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        #unique_together = (('group_id', 'permission_id'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=50)
    content_type = models.ForeignKey('DjangoContentType')
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        #unique_together = (('content_type_id', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=75)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser)
    group = models.ForeignKey(AuthGroup)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        #unique_together = (('user_id', 'group_id'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser)
    permission = models.ForeignKey(AuthPermission)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        #unique_together = (('user_id', 'permission_id'),)


class Bookmark(models.Model):
    bookmark_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('UserInfo')
    object_type = models.ForeignKey('ObjectType')
    object_id = models.CharField(max_length=32)
    date_created = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'bookmark'


class Comment(models.Model):
    object_id = models.TextField()
    user = models.ForeignKey('UserInfo')
    text = models.TextField()
    creation_date = models.DateTimeField()
    comment_id = models.AutoField(primary_key=True)
    object_type_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'comment'


class Config(models.Model):
    key = models.CharField(max_length=255, blank=True, null=True)
    value = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'config'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    user = models.ForeignKey(AuthUser)
    content_type = models.ForeignKey('DjangoContentType', blank=True, null=True)
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        #unique_together = (('app_label', 'model'),)


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class EmailVerification(models.Model):
    user = models.ForeignKey('UserInfo', unique=True)
    verification_token = models.CharField(max_length=64)

    class Meta:
        managed = False
        db_table = 'email_verification'


class FailedAnalysis(models.Model):
    failed_analysis_id = models.CharField(primary_key=True, max_length=32)
    analysis_date = models.DateTimeField(blank=True, null=True)
    resolved = models.NullBooleanField()
    recording_id = models.CharField(max_length=40)
    cuex_id = models.CharField(max_length=40, blank=True, null=True)
    noise_level = models.SmallIntegerField(blank=True, null=True)
    detail_level = models.SmallIntegerField(blank=True, null=True)
    user = models.ForeignKey('UserInfo', blank=True, null=True)
    click_track = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'failed_analysis'


class Likes(models.Model):
    like_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('UserInfo', blank=True, null=True)
    object_type = models.ForeignKey('ObjectType', blank=True, null=True)
    object_id = models.CharField(max_length=32, blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'likes'
        verbose_name_plural = 'Users'


class MailingListQueue(models.Model):
    user = models.ForeignKey('UserInfo')
    handled = models.NullBooleanField()
    mailing_list_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mailing_list_queue'


class ObjectCounters(models.Model):
    object_type = models.ForeignKey('ObjectType')
    object_id = models.TextField()
    like_count = models.IntegerField()
    bookmark_count = models.IntegerField()
    comment_count = models.IntegerField()
    view_count = models.IntegerField()
    play_count = models.IntegerField()
    creation_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'object_counters'


class ObjectType(models.Model):
    object_type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'object_type'

    def __unicode__(self):
        return self.name or self.object_type_id


class PasswordReset(models.Model):
    user = models.ForeignKey('UserInfo')
    reset_token = models.CharField(unique=True, max_length=64)
    reset_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'password_reset'


class RecordingAnalysis(models.Model):
    analysis_id = models.CharField(primary_key=True, max_length=32)
    recording_id = models.CharField(max_length=40, blank=True, null=True)
    cuex_id = models.CharField(max_length=40, blank=True, null=True)
    scld_id = models.CharField(max_length=40, blank=True, null=True)
    noise_level = models.SmallIntegerField(blank=True, null=True)
    detail_level = models.SmallIntegerField(blank=True, null=True)
    duration = models.IntegerField(blank=True, null=True)
    scls_id = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recording_analysis'


class RecordingDerivedSong(models.Model):
    song = models.ForeignKey('Song', unique=True)
    recording_id = models.CharField(max_length=40)
    current_analysis = models.ForeignKey(RecordingAnalysis, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recording_derived_song'
        #unique_together = (('song_id', 'recording_id'),)


class Session(models.Model):
    sid = models.CharField(primary_key=True, max_length=500)
    sess = models.TextField()  # This field type is a guess.
    expire = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'session'


class SessionInfo(models.Model):
    session_id = models.CharField(primary_key=True, max_length=64)
    session_info = models.TextField(blank=True, null=True)
    last_update = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'session_info'


class Snippet(models.Model):
    snippet_id = models.CharField(primary_key=True, max_length=32)
    analysis_id = models.CharField(max_length=32, blank=True, null=True)
    title = models.TextField(blank=True, null=True)
    author_id = models.CharField(max_length=32)
    scls_id = models.CharField(max_length=40)
    creation_date = models.DateTimeField(blank=True, null=True)
    last_update = models.DateTimeField(blank=True, null=True)
    state = models.TextField()  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'snippet'


class Song(models.Model):
    song_id = models.CharField(primary_key=True, max_length=32)
    source_type = models.TextField(blank=True, null=True)  # This field type is a guess.
    author = models.ForeignKey('UserInfo', blank=True, null=True)
    title = models.TextField(blank=True, null=True)
    creation_date = models.DateTimeField(blank=True, null=True)
    is_active = models.NullBooleanField()
    is_shared = models.NullBooleanField()
    is_deleted = models.NullBooleanField()
    is_unsorted = models.NullBooleanField()
    current_scld_id = models.CharField(max_length=40, blank=True, null=True)
    meta = JSONField(blank=True, null=True) # This field type is a guess.
    current_revision_id = models.CharField(max_length=32, blank=True, null=True)
    last_update = models.DateTimeField(blank=True, null=True)
    permissions = JSONField(blank=True, null=True)  # This field type is a guess.
    is_public = models.NullBooleanField()
    popularity = models.IntegerField()
    maturity = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'song'

    def __unicode__(self):
        return self.title or self.song_id


class SongCollection(models.Model):
    collection_id = models.CharField(primary_key=True, max_length=32)
    owner_id = models.CharField(max_length=32)
    collection_type = models.TextField()  # This field type is a guess.
    collection_name = models.CharField(max_length=255, blank=True, null=True)
    folder_view = models.TextField(blank=True, null=True)
    creation_date = models.DateTimeField(blank=True, null=True)
    permissions = models.TextField(blank=True, null=True)  # This field type is a guess.
    is_deleted = models.NullBooleanField()

    class Meta:
        managed = False
        db_table = 'song_collection'
        verbose_name_plural='Collections'

class SongFolder(models.Model):
    song = models.ForeignKey(Song, blank=True, null=True)
    collection = models.ForeignKey(SongCollection, blank=True, null=True)
    folder_id = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'song_folder'


class SongMeta(models.Model):
    song = models.ForeignKey(Song, primary_key=True)
    description = models.TextField(blank=True, null=True)
    embed = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'song_meta'


class SongRevision(models.Model):
    revision_id = models.CharField(primary_key=True, max_length=32)
    parent_revision_id = models.CharField(max_length=32, blank=True, null=True)
    song_id = models.CharField(max_length=32, blank=True, null=True)
    scld_id = models.CharField(max_length=40, blank=True, null=True)
    revision_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'song_revision'


class SongStaticInfo(models.Model):
    song = models.ForeignKey(Song)
    front = models.TextField(blank=True, null=True)  # This field type is a guess.
    pages = models.TextField(blank=True, null=True)  # This field type is a guess.
    audio_tracks = models.TextField(blank=True, null=True)  # This field type is a guess.
    grid = models.TextField(blank=True, null=True)  # This field type is a guess.
    audio_mixdown = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'song_static_info'


class SongTransferLog(models.Model):
    song_transfer_log_id = models.AutoField(primary_key=True)
    from_user = models.TextField(blank=True, null=True)
    to_user = models.ForeignKey('UserInfo', blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'song_transfer_log'


class Subscription(models.Model):
    subscription_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'subscription'


class SubscriptionFeature(models.Model):
    subscription_feature_id = models.AutoField(primary_key=True)
    key = models.CharField(max_length=255, blank=True, null=True)
    value = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'subscription_feature'


class SubscriptionProviderData(models.Model):
    user = models.ForeignKey('UserInfo', blank=True, null=True)
    subscription_name = models.TextField(blank=True, null=True)
    provider = models.TextField(blank=True, null=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'subscription_provider_data'


class SubscriptionToFeature(models.Model):
    subscription_to_feature_id = models.AutoField(primary_key=True)
    subscription = models.ForeignKey(Subscription, blank=True, null=True)
    subscription_feature = models.ForeignKey(SubscriptionFeature, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'subscription_to_feature'


class VoucherCode(models.Model):
    voucher_code = models.TextField(unique=True, blank=True, null=True)
    plan_name = models.TextField(blank=True, null=True)
    user = models.ForeignKey('UserInfo', blank=True, null=True)
    months_active = models.IntegerField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    claimable_until = models.DateTimeField(blank=True, null=True)
    claimed_date = models.DateTimeField(blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'subscription_voucher_code'


class Tag(models.Model):
    tag_id = models.AutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=255, blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tag'


class TagToObject(models.Model):
    tag_to_object_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('UserInfo', blank=True, null=True)
    tag = models.ForeignKey(Tag, blank=True, null=True)
    object_type = models.ForeignKey(ObjectType, blank=True, null=True)
    object_id = models.CharField(max_length=32, blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tag_to_object'


class UserFlag(models.Model):
    flag_id = models.AutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=255, blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_flag'


class UserFlagToUser(models.Model):
    user_flag_to_user_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('UserInfo', blank=True, null=True)
    flag = models.ForeignKey(UserFlag, blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_flag_to_user'


class UserGroup(models.Model):
    group_id = models.CharField(primary_key=True, max_length=32)
    name = models.CharField(max_length=255, blank=True, null=True)
    owner = models.ForeignKey('UserInfo', blank=True, null=True)
    created = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_group'


class UserGroupMember(models.Model):
    user = models.ForeignKey('UserInfo', blank=True, null=True)
    group = models.ForeignKey(UserGroup, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_group_member'
        #unique_together = (('user_id', 'group_id'),)


class UserInfo(models.Model):
    user_id = models.CharField(primary_key=True, max_length=32)
    username = models.TextField(unique=True)
    email = models.TextField(unique=True, blank=True, null=True)
    user_type = models.TextField()  # This field type is a guess.
    user_count = models.IntegerField(blank=True, null=True)
    registration_date = models.DateTimeField(blank=True, null=True)
    facebook_id = models.CharField(max_length=20, blank=True, null=True)
    collection = models.ForeignKey(SongCollection, blank=True, null=True)
    registration_app = models.ForeignKey(App, blank=True, null=True)
    pre_subscription_registration = models.NullBooleanField()
    ip = models.CharField(max_length=32, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    tagline = models.CharField(max_length=255, blank=True, null=True)
    display_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_info'
        verbose_name_plural = 'Users'

    def __unicode__(self):
        return self.username or self.user_id


class UserSecret(models.Model):
    user = models.ForeignKey(UserInfo)
    secret = models.CharField(max_length=60)

    class Meta:
        managed = False
        db_table = 'user_secret'


class UserSession(models.Model):
    session_id = models.CharField(primary_key=True, max_length=64)
    user = models.ForeignKey(UserInfo)
    start_time = models.DateTimeField(blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_session'


class UserSubscription(models.Model):
    user_subscription_id = models.AutoField(primary_key=True)
    subscription = models.ForeignKey(Subscription, blank=True, null=True)
    user = models.ForeignKey(UserInfo, blank=True, null=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    source_app = models.ForeignKey(App, blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_subscription'
        #unique_together = (('subscription_id', 'user_id'),)


class UserSubscriptionStatus(models.Model):
    user = models.ForeignKey(UserInfo, blank=True, null=True)
    subscription_name = models.TextField(blank=True, null=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)
    is_trial = models.NullBooleanField()
    is_cancelled = models.NullBooleanField()
    billing_cycle = models.IntegerField(blank=True, null=True)
    provider = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_subscription_status'
        verbose_name_plural = 'User Subscription Statuses'
