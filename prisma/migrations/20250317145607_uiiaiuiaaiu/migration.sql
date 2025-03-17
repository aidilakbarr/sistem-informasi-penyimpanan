/*
  Warnings:

  - The `fotoBarang` column on the `Pemesanan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Pemesanan" DROP COLUMN "fotoBarang",
ADD COLUMN     "fotoBarang" TEXT[];
