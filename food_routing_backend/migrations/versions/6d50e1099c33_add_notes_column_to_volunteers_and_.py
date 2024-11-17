from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "6d50e1099c33"
down_revision = "d591be91d2e1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add 'notes', 'address', and 'phone_number' columns to the 'volunteers' table
    op.add_column("volunteers", sa.Column("notes", sa.String(), nullable=True))
    op.add_column("volunteers", sa.Column("address", sa.String(), nullable=True))
    op.add_column("volunteers", sa.Column("phone_number", sa.String(), nullable=True))

    # Add 'notes', 'address', and 'phone_number' columns to the 'drivers' table
    op.add_column("drivers", sa.Column("notes", sa.String(), nullable=True))
    op.add_column("drivers", sa.Column("address", sa.String(), nullable=True))
    op.add_column("drivers", sa.Column("phone_number", sa.String(), nullable=True))


def downgrade() -> None:
    # Remove 'notes', 'address', and 'phone_number' columns from the 'volunteers' table
    op.drop_column("volunteers", "notes")
    op.drop_column("volunteers", "address")
    op.drop_column("volunteers", "phone_number")

    # Remove 'notes', 'address', and 'phone_number' columns from the 'drivers' table
    op.drop_column("drivers", "notes")
    op.drop_column("drivers", "address")
    op.drop_column("drivers", "phone_number")
