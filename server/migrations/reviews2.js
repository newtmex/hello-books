const migration = {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('Reviews', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    }),
  down: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('Reviews', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    }),
};

export default migration;

