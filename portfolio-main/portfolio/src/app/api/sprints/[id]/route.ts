import { NextResponse } from 'next/server';
import { client } from "@/lib/appwrite_client";
import { Databases, Query } from "appwrite";

const database = new Databases(client);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_SPRINT as string,
      [
        Query.equal("alunos", id),
        Query.orderAsc("$createdAt")
      ]
    );

    return NextResponse.json(response.documents);
  } catch (e) {
    console.error("Falha na recuperação de dados: ", e);
    return NextResponse.json({ message: "Falha na recuperação de dados: " + e }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { nomeSprint, descricao, dataEntrega } = await request.json();

    if (!nomeSprint || !descricao || !dataEntrega) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_SPRINT as string,
      "unique()",
      {
        alunos: params.id,
        nomeSprint,
        descricao,
        dataEntrega
      }
    );

    return NextResponse.json(response, { status: 201 });
  } catch (e) {
    console.error("Erro ao adicionar dados: ", e);
    return NextResponse.json({ message: "Erro ao adicionar dados: " + e }, { status: 500 });
  }
}
