"use server";

import { createCredentialSchema } from "@/schemas/credential";
import z from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { symmetricEncrypt } from "@/lib/encryption";

export async function createCredential(
  form: z.infer<typeof createCredentialSchema>
) {
  const { success, data } = createCredentialSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  //encrypt value
  const encryptedValue = symmetricEncrypt(data.value);

  // console.log("Testing: ", {
  //   plain: data.value,
  //   encrypted: encryptedValue,
  // });

  const result = await prisma.credentials.create({
    data: {
      name: data.name,
      value: encryptedValue,
      userId,
    },
  });

  if (!result) {
    throw new Error("Failed to create credential");
  }

  revalidatePath("/credentials");
}
