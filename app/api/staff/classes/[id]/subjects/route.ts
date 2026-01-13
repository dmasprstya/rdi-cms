import { NextRequest, NextResponse } from 'next/server';
import { GET as GuruGetSubjects } from '../../../../guru/classes/[classId]/subjects/route';

// Wrapper to map staff [id] param to guru [classId] param
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    // Map staff's [id] to guru's [classId]
    return GuruGetSubjects(req, { params: { classId: params.id } });
}
