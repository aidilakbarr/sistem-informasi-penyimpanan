-- CreateTable
CREATE TABLE "Pemesanan" (
    "id" TEXT NOT NULL,
    "fotoBarang" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsiBarang" TEXT,
    "durasiPenyimpanan" TEXT NOT NULL,
    "ukuranBarang" TEXT NOT NULL,
    "catatan" TEXT,
    "estimasiHarga" INTEGER,
    "penjemputan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pemesanan_pkey" PRIMARY KEY ("id")
);
