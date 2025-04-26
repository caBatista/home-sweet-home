-- CreateTable
CREATE TABLE "ProcessedPayment" (
    "id" SERIAL NOT NULL,
    "externalReference" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedPayment_externalReference_key" ON "ProcessedPayment"("externalReference");
