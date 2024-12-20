// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const GET = async (req: NextRequest) => {
//   try {
//     const id = req.url.split("/").pop();

//     if (!id) {
//       return NextResponse.json(
//         { error: "ID de l'utilisateur manquant." },
//         { status: 400 }
//       );
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         id: id,
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Utilisateur introuvable." },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(user);
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// };
