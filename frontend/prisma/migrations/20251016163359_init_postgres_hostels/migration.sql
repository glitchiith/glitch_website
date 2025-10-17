-- CreateTable
CREATE TABLE "Hostels" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Hostels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "uid" VARCHAR(128) NOT NULL,
    "name" VARCHAR(255),
    "hostel_id" INTEGER,
    "bestScore1" INTEGER NOT NULL DEFAULT 0,
    "bestScore2" INTEGER NOT NULL DEFAULT 0,
    "bestScore3" INTEGER NOT NULL DEFAULT 0,
    "bestScore4" INTEGER NOT NULL DEFAULT 0,
    "bestScore5" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentHostels" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "hostel_id" INTEGER NOT NULL,

    CONSTRAINT "StudentHostels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hostels_name_key" ON "Hostels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "StudentHostels_email_key" ON "StudentHostels"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hostel_id_fkey" FOREIGN KEY ("hostel_id") REFERENCES "Hostels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentHostels" ADD CONSTRAINT "StudentHostels_hostel_id_fkey" FOREIGN KEY ("hostel_id") REFERENCES "Hostels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
