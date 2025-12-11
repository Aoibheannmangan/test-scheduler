"""Add leave to event_type_enum

Revision ID: 0da54b2ed325
Revises: 8b3ba104ea40
Create Date: 2025-12-11 11:06:41.649664

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0da54b2ed325'
down_revision = '8b3ba104ea40'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("ALTER TYPE event_type_enum ADD VALUE IF NOT EXISTS 'leave';")


def downgrade():
    pass
