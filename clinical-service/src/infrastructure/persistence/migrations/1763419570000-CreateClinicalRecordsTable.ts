import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateClinicalRecordsTable1763419570000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clinical_records',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'patient_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'tumor_type_id',
            type: 'int',
          },
          {
            name: 'diagnosis_date',
            type: 'date',
          },
          {
            name: 'stage',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'treatment_protocol',
            type: 'text',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Foreign key para patient_id
    await queryRunner.createForeignKey(
      'clinical_records',
      new TableForeignKey({
        columnNames: ['patient_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'patients',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Foreign key para tumor_type_id
    await queryRunner.createForeignKey(
      'clinical_records',
      new TableForeignKey({
        columnNames: ['tumor_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tumor_types',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('clinical_records');
    if (table) {
      const foreignKeyPatient = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('patient_id') !== -1,
      );
      const foreignKeyTumorType = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('tumor_type_id') !== -1,
      );

      if (foreignKeyPatient) {
        await queryRunner.dropForeignKey('clinical_records', foreignKeyPatient);
      }
      if (foreignKeyTumorType) {
        await queryRunner.dropForeignKey(
          'clinical_records',
          foreignKeyTumorType,
        );
      }
    }

    await queryRunner.dropTable('clinical_records');
  }
}

