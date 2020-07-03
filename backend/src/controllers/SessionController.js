const connection = require('../database/connection');
const encryptPWD = require('../utils/encryptPWD');

module.exports = {
    async create(request, response) {

        const { email, pwd } = request.body;

        const user = await connection('user')
            .where('email', email)
            .andWhere('pwd', encryptPWD(pwd))
            .select('id')
            .first();

        if (!user) {
            return response.status(400).json({ error: 'Nenhum Usuário encontrado com esse Login' });
        }

        return response.json(user);
    }
}
