import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { name, email, phone, propertyType, evModel, timeline, hasGarage, zipCode, cityId } = body;

        // Validate required fields
        if (!name || !email || !phone || !zipCode || !cityId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create lead in database
        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone,
                propertyType: propertyType || 'single-family',
                evModel: evModel || null,
                timeline: timeline || 'immediate',
                hasGarage: hasGarage !== undefined ? hasGarage : null,
                zipCode,
                cityId,
                qualified: false,
                status: 'new',
            },
        });

        // TODO: Send lead to lead buyers (Networx, HomeAdvisor, etc.)
        // TODO: Send confirmation email to user
        // TODO: Trigger call tracking system

        return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });

    } catch (error) {
        console.error('Error creating lead:', error);
        return NextResponse.json(
            { error: 'Failed to submit lead' },
            { status: 500 }
        );
    }
}
