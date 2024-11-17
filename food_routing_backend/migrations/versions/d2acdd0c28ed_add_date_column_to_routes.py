"""Add date column to routes

Revision ID: d2acdd0c28ed
Revises: 6d50e1099c33
Create Date: 2024-11-11 13:03:10.276230

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd2acdd0c28ed'
down_revision: Union[str, None] = '6d50e1099c33'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
