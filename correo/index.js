const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'navarreteportfolio@gmail.com', 
    pass: 'ojam xwby hpxi tbjf' 
  }
});

app.post('/api/contacto', async (req, res) => {
  const { asunto, mensaje } = req.body;
  try {
    await transporter.sendMail({
      from: 'navarreteportfolio@gmail.com',
      to: 'navarretead6@gmail.com',
      subject: asunto,
      text: mensaje
    });
    res.status(200).json({ ok: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al enviar el correo', error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de correo escuchando en http://localhost:${PORT}`);
}); 