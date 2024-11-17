"""Add notes, address, and phone_number to volunteers and drivers

Revision ID: d591be91d2e1
Revises: 533b65a2b958
Create Date: 2024-11-11 12:35:58.353553

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd591be91d2e1'
down_revision: Union[str, None] = '533b65a2b958'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
