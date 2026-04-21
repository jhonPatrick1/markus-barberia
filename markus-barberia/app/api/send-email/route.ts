import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializamos Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// El cerebro distribuidor: Mapea cada ID de barbero con su correo real
const correosBarberos: Record<number, string> = {
  1: "yeampierpadilla@gmail.com", 2: "jhonpatrickcg@gmail.com", 3: "Hanziel69barber@gmail.com", 4: "markus.barbero@markus.com",
  5: "Irigoinjerson@gmail.com", 6: "manuel@markus.com", 7: "Farfanchambad@gmail.com", 8: "romaynaandres42@gmail.com",
  9: "luis.barber19@gmail.com", 10: "ashly@markus.com", 11: "sebastian@markus.com", 12: "andres.magdalena@markus.com",
  13: "luis@markus.com", 14: "richard@markus.com", 15: "murayarihuaicamae@gmail.com"
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { barberoId, barberoNombre, clienteNombre, fecha, hora, servicios, montoTotal } = body;

    if (!barberoId || !clienteNombre || !fecha || !hora) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Buscamos el correo correspondiente. Si no lo encuentra por algún error, te lo manda al admin.
    const emailDestinoReal = correosBarberos[Number(barberoId)] || "admin@markus.com";

    const data = await resend.emails.send({
      // 🔥 MAGIA 1: Ahora el correo sale con tu dominio profesional
      from: 'Markus Barbería <citas@markusbarberia.com>', 
      
      // 🔥 MAGIA 2: Ahora el correo viaja directo a la bandeja del barbero elegido
      to: [emailDestinoReal], 
      
      subject: `✂️ ¡NUEVA RESERVA PARA ${barberoNombre.toUpperCase()}!`,
      html: `
        <div style="font-family: sans-serif; color: #161616; max-w: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #101010; padding: 20px; text-align: center;">
            <h2 style="color: #B07D54; margin: 0; letter-spacing: 2px;">NUEVA RESERVA</h2>
          </div>
          <div style="padding: 30px; background-color: #FAFAFA;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hola <strong>${barberoNombre}</strong>, tienes una nueva cita agendada en el sistema.</p>
            
            <div style="background-color: #FFF; padding: 20px; border-radius: 8px; border-left: 4px solid #B07D54; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <p style="margin: 0 0 10px 0;">👤 <strong>Cliente:</strong> ${clienteNombre}</p>
              <p style="margin: 0 0 10px 0;">📅 <strong>Fecha:</strong> ${fecha}</p>
              <p style="margin: 0 0 10px 0;">⏰ <strong>Hora:</strong> ${hora}</p>
              <p style="margin: 0 0 10px 0;">💈 <strong>Servicios:</strong> ${servicios}</p>
              <p style="margin: 0 0 0 0; color: #25D366; font-size: 18px; font-weight: bold;">💰 Total a Cobrar: S/ ${Number(montoTotal || 0).toFixed(2)}</p>
            </div>
            
            <p style="font-size: 12px; color: #888; margin-top: 30px; text-align: center;">
              *Este es un correo automático del sistema de reservas de Markus Barbería.
            </p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('Fallo crítico al enviar correo con Resend:', error);
    return NextResponse.json({ error: 'Error interno al enviar el correo' }, { status: 500 });
  }
}