export default async function dbInit(mysql, dbConfig, io) {
    try {
        const connection = await mysql.createConnection(dbConfig);

        await connection.query('CREATE DATABASE IF NOT EXISTS warships');

        await connection.query('USE warships');

        console.log('Database connection established: "warships"');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                playerA VARCHAR(255) NOT NULL,
                playerB VARCHAR(255) NOT NULL,
                winner VARCHAR(255) NOT NULL
            )
        `);
        console.log('Results table created');
        return connection;
    } catch (error) {
        io.emit('error', 'Database error...')
        console.error('Error initializing database:', error.message);
    }
}