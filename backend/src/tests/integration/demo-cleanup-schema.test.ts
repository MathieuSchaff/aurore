import { describe, expect, it } from 'bun:test'

import { sql } from 'drizzle-orm'

import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'

setupDbTests()

const CLEANUP_BLOCKING_FOREIGN_KEYS = [
  {
    sourceTable: 'discussion_threads',
    sourceColumn: 'ingredient_id',
    targetTable: 'ingredients',
    targetColumn: 'id',
    deleteAction: 'restrict',
  },
  {
    sourceTable: 'discussion_threads',
    sourceColumn: 'product_id',
    targetTable: 'products',
    targetColumn: 'id',
    deleteAction: 'restrict',
  },
  {
    sourceTable: 'ingredient_edits',
    sourceColumn: 'edited_by',
    targetTable: 'users',
    targetColumn: 'id',
    deleteAction: 'no action',
  },
  {
    sourceTable: 'product_edits',
    sourceColumn: 'edited_by',
    targetTable: 'users',
    targetColumn: 'id',
    deleteAction: 'no action',
  },
  {
    sourceTable: 'social_posts',
    sourceColumn: 'ingredient_id',
    targetTable: 'ingredients',
    targetColumn: 'id',
    deleteAction: 'restrict',
  },
  {
    sourceTable: 'social_posts',
    sourceColumn: 'product_id',
    targetTable: 'products',
    targetColumn: 'id',
    deleteAction: 'restrict',
  },
]

describe('demo cleanup schema contract', () => {
  it('lists every user and catalog foreign key that cannot delete itself', async () => {
    // CASCADE and SET NULL edges remove themselves, so cleanup only owns these blockers.
    const rows = await testDb.execute(sql`
      SELECT
        source_table.relname AS "sourceTable",
        source_column.attname AS "sourceColumn",
        target_table.relname AS "targetTable",
        target_column.attname AS "targetColumn",
        CASE constraint_row.confdeltype
          WHEN 'a' THEN 'no action'
          WHEN 'r' THEN 'restrict'
        END AS "deleteAction"
      FROM pg_constraint AS constraint_row
      JOIN pg_class AS source_table
        ON source_table.oid = constraint_row.conrelid
      JOIN pg_namespace AS source_namespace
        ON source_namespace.oid = source_table.relnamespace
      JOIN pg_class AS target_table
        ON target_table.oid = constraint_row.confrelid
      JOIN unnest(constraint_row.conkey) WITH ORDINALITY AS source_key(attnum, position)
        ON true
      JOIN unnest(constraint_row.confkey) WITH ORDINALITY AS target_key(attnum, position)
        ON target_key.position = source_key.position
      JOIN pg_attribute AS source_column
        ON source_column.attrelid = source_table.oid
        AND source_column.attnum = source_key.attnum
      JOIN pg_attribute AS target_column
        ON target_column.attrelid = target_table.oid
        AND target_column.attnum = target_key.attnum
      WHERE constraint_row.contype = 'f'
        AND source_namespace.nspname = 'public'
        AND target_table.relname IN ('users', 'products', 'ingredients')
        AND constraint_row.confdeltype IN ('a', 'r')
      ORDER BY source_table.relname, source_column.attname
    `)

    expect(rows).toEqual(CLEANUP_BLOCKING_FOREIGN_KEYS)
  })
})
