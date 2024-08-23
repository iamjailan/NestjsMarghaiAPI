-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "age" INTEGER,
    "dob" TIMESTAMP(3),
    "bio" TEXT,
    "city" TEXT,
    "country" TEXT,
    "address" TEXT,
    "profile_picture" TEXT,
    "gender" TEXT,
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
