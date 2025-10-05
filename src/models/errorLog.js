module.exports = (sequelize, DataTypes) => {
  const ErrorLog = sequelize.define(
    "ErrorLog",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "User ID if authenticated",
      },
      method: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "HTTP method",
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      statusCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      errorStack: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "error_logs",
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["statusCode"],
        },
        {
          fields: ["createdAt"],
        },
      ],
    }
  );

  return ErrorLog;
};
