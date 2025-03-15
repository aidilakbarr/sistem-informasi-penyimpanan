/*
  Warnings:

  - You are about to drop the column `estimasiHarga` on the `Pemesanan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pemesanan" DROP COLUMN "estimasiHarga",
ADD COLUMN     "harga" INTEGER,
ADD COLUMN     "isAccepted" BOOLEAN NOT NULL DEFAULT false;
