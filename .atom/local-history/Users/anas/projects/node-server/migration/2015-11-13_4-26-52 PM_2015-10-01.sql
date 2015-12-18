CREATE MATERIALIZED VIEW song_view AS 
 SELECT song.song_id,
    song.source_type,
    song.author_id,
    song.title,
    song.creation_date,
    song.is_active,
    song.is_shared,
    song.is_deleted,
    song.is_unsorted,
    song.current_scld_id,
    song.meta,
    song.current_revision_id,
    song.last_update,
    song.is_public,
    song.permissions,
    song.maturity,
    song.popularity,
    object_counters.comment_count,
    object_counters.like_count,
    object_counters.bookmark_count,
    object_counters.view_count,
    object_counters.play_count,
    ra.analysis_id,
    ra.recording_id,
    ra.cuex_id,
    ra.scld_id,
    ra.noise_level,
    ra.detail_level,
    ra.duration,
    ra.scls_id,
    user_info.username,
    user_info.display_name,
    tags_names.tags_names,
    song.maturity * 10 + song.popularity AS song_best_score
   FROM song
     LEFT JOIN recording_derived_song rds USING (song_id)
     LEFT JOIN recording_analysis ra ON rds.current_analysis_id = ra.analysis_id
     LEFT JOIN user_info ON user_info.user_id = song.author_id
     LEFT JOIN object_counters ON object_counters.object_type_id = 1 AND object_counters.object_id = song.song_id::text
     LEFT JOIN ( SELECT tagfilter.object_id,
            array_to_string(array_agg(tagfilter.name), '|-|'::text) AS tags_names
           FROM ( SELECT tag_to_object.tag_id,
                    tag.name,
                    tag_to_object.object_id
                   FROM tag_to_object
                     RIGHT JOIN tag ON tag.tag_id = tag_to_object.tag_id) tagfilter
          GROUP BY tagfilter.object_id) tags_names ON tags_names.object_id::bpchar = song.song_id;