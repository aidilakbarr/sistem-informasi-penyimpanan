/*
  Warnings:

  - You are about to drop the column `harga` on the `Pemesanan` table. All the data in the column will be lost.
  - You are about to drop the column `isAccepted` on the `Pemesanan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pemesanan" DROP COLUMN "harga",
DROP COLUMN "isAccepted",
ADD COLUMN     "estimasiHarga" INTEGER;
