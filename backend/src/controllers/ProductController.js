const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const { page = 1 } = request.query;
        const user_id = request.headers.authorization;

        const [count] = await connection('bill').where('bill.user_id', user_id).count();

        const bill = await connection('bill')
            .join('user', 'user.id', '=', 'bill.user_id')
            .andWhere('bill.user_id', user_id)
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'bill.*'
            ]);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(bill);
    },

    async create(request, response) {
        const { month, year, status, monthly_consumption, monthly_value, due_date } = request.body;
        const user_id = request.headers.authorization;

        const [id] = await connection('bill').insert({
            month,
            year,
            status,
            monthly_consumption,
            monthly_value,
            due_date,
            user_id,
        });

        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const user_id = request.headers.authorization;

        const bill = await connection('bill')
            .where('id', id)
            .select('user_id')
            .first();

        if (bill.user_id != user_id) {
            return response.status(401).json({ error: 'Operação não permitida.' });
        }

        await connection('bill').where('id', id).delete();

        return response.status(204).send();
    }
};
