create
or replace function pullSync (last_pulled_at bigint default 0) returns jsonb as $$
--- variables declared
declare 
    _ts timestamp with time zone;
    _groups JSONB;
    _group_members JSONB;
    _shopping_lists JSONB;
    _shopping_list_items JSONB;

begin
  -- Convert last_pulled_at to timestamp
  _ts := to_timestamp(last_pulled_at / 1000.0);

---------------------------
-----------groups----------
---------------------------

    SELECT jsonb_build_object(
        'created',
        '[]'::jsonb,
        'updated',
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', g.id,
                    'name', g.name,
                    'description', g.description,
                    'owner_id', g.owner_id,
                    'created_at', timestamp_to_epoch(g.created_at),
                    'updated_at', timestamp_to_epoch(g.updated_at)
                )
            ) FILTER (
                WHERE g.deleted_at IS NULL
                AND g.updated_at > _ts
            ),
            '[]'::jsonb
        ),
        'deleted',
        COALESCE(
            jsonb_agg(to_jsonb(g.id)) FILTER (
                WHERE g.deleted_at IS NOT NULL
                AND g.updated_at > _ts
            ),
            '[]'::jsonb
        )
    ) INTO _groups
    FROM groups g
    WHERE EXISTS (
        SELECT 1
        FROM group_members gm
        WHERE g.id = gm.group_id
        AND gm.user_id = auth.uid()
        AND gm.deleted_at IS NULL -- Check if the user has not left the group
    );


---------------------------------
----------group_members----------
---------------------------------

    SELECT jsonb_build_object(
        'created',
        '[]'::jsonb,
        'updated',
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', gm.id,
                    'group_id', gm.group_id,
                    'user_id', gm.user_id,
                    'role', gm.role,
                    'created_at', timestamp_to_epoch(gm.created_at),
                    'updated_at', timestamp_to_epoch(gm.updated_at)
                )
            ) FILTER (
                WHERE gm.deleted_at IS NULL
                AND gm.updated_at > _ts
            ),
            '[]'::jsonb
        ),
        'deleted',
        COALESCE(
            jsonb_agg(to_jsonb(gm.id)) FILTER (
                WHERE gm.deleted_at IS NOT NULL
                AND gm.updated_at > _ts
            ),
            '[]'::jsonb
        )
    ) INTO _group_members
    FROM group_members gm
    WHERE gm.user_id = auth.uid();


---------------------------------
----------shopping_list----------
---------------------------------

  SELECT jsonb_build_object(
    'created', '[]'::jsonb,
    
    -- Updated items
    'updated', COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', sl.id,
          'group_id', sl.group_id,
          'user_id', sl.user_id,
          'name', sl.name,
          'description', sl.description,
          'created_at', timestamp_to_epoch(sl.created_at),
          'updated_at', timestamp_to_epoch(sl.updated_at),
          'due_date_at', timestamp_to_epoch(sl.due_date_at)
        )
      ) FILTER (
        WHERE sl.deleted_at IS NULL
        AND sl.updated_at > _ts
      ),
      '[]'::jsonb
    ),

    -- Deleted items
    'deleted', COALESCE(
      jsonb_agg(to_jsonb(sl.id)) FILTER (
        WHERE sl.deleted_at IS NOT NULL
        AND sl.updated_at > _ts
      ),
      '[]'::jsonb
    )
  ) INTO _shopping_lists
  FROM shopping_list sl
  WHERE sl.group_id IN (
    SELECT gm.group_id
    FROM group_members gm
    WHERE gm.user_id = auth.uid()
    AND gm.deleted_at IS NULL
  );


---------------------------------
-----shopping_list_item----------
---------------------------------

  SELECT jsonb_build_object(
    'created', '[]'::jsonb,
    'updated', COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', sli.id,
          'shopping_list_id', sli.shopping_list_id,
          'user_id', sli.user_id,
          'name', sli.name,
          'category', sli.category,
          'note', sli.note,
          'priority', sli.priority,
          'quantity', sli.quantity,
          'is_purchased', sli.is_purchased,
          'unit', sli.unit,
          'created_at', timestamp_to_epoch(sli.created_at),
          'updated_at', timestamp_to_epoch(sli.updated_at)
        )
      ) FILTER (
        WHERE sli.deleted_at IS NULL
        AND sli.updated_at > _ts
      ),
      '[]'::jsonb
    ),
    'deleted', COALESCE(
      jsonb_agg(to_jsonb(sli.id)) FILTER (
        WHERE sli.deleted_at IS NOT NULL
        AND sli.updated_at > _ts
      ),
      '[]'::jsonb
    )
  )
  INTO _shopping_list_items
  FROM shopping_list_item sli
  WHERE sli.shopping_list_id IN (
    SELECT sl.id
    FROM shopping_list sl
    WHERE sl.group_id IN (
      SELECT gm.group_id
      FROM group_members gm
      WHERE gm.user_id = auth.uid()
      AND gm.deleted_at IS NULL
    )
  );


--------------------------------
--------------------------------
--------------------------------
--------------------------------

    -- Return changes and the current timestamp
    RETURN jsonb_build_object(
        'changes', jsonb_build_object(
            'groups', _groups,
            'group_members', _group_members,
            'shopping_list', _shopping_lists,
            'shopping_list_item', _shopping_list_items
        ),
        'timestamp', timestamp_to_epoch(now())
    );
end;
$$ language plpgsql;
