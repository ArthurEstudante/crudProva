"use server"

import { sql } from "drizzle-orm";
import db from "./db";
import { redirect } from 'next/navigation'


type TarefaType = {
    id: number | null
    titulo: string
    descricao: string
}

export default TarefaType

export async function getEmptyTarefa(): Promise<TarefaType> {
    return { id: null, titulo: "", descricao: "" }
}
export async function getTarefas(): Promise<TarefaType[]> {
    return await db.execute(sql`SELECT * FROM tarefa ORDER BY id`) as TarefaType[]
}

export async function saveTarefa(formData: FormData) {
    const id = +(formData.get('id') as string) as number
    const titulo = formData.get('titulo') as string
    const descricao = formData.get('descricao') as string

    const tarefa: TarefaType = {
        id,
        titulo,
        descricao
    }

    if (!id) {
       await db.execute(sql`INSERT INTO tarefa (titulo, descricao) VALUES (${tarefa.titulo}, ${tarefa.descricao})`)
    } else {
        await db.execute(sql`UPDATE tarefa SET titulo=${tarefa.titulo}, descricao=${tarefa.descricao} WHERE id=${tarefa.id}`)
    }

    redirect('/')
}

export async function removeTarefa(tarefa: TarefaType) {

    await db.execute(sql`DELETE FROM tarefa WHERE id=${tarefa.id}`)

    redirect('/')
}