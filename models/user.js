const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/dbconfig");

const bcrypt = require("bcryptjs");


// Define User model
class User extends Model {
  // Compare password method
  static async comparePassword(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
}

User.init(
  {
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6],
      },
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female"),
      allowNull: false,
    },
    pronouns: {
      type: DataTypes.ENUM("he/him", "she/her", "they/them"),
      allowNull: false,
    },
    preferredName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    pinCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    github: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize: sequelize,
    modelName: "User",
    tableName: "users",
    hooks: {
      beforeSave: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Define Education model
class Education extends Model {}

Education.init(
  {
    school: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fieldOfStudy: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    startYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Education",
    tableName: "education",
  }
);

// Define WorkExperience model
class WorkExperience extends Model {}

WorkExperience.init(
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    locationState: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    locationCountry: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "WorkExperience",
    tableName: "work_experience",
  }
);

class Skill extends Model {}

Skill.init(
  {
    skill_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.ENUM("programming_language", "other_skill"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Skill",
    tableName: "skills",
  }
);

class UserSkill extends Model {}
UserSkill.init(
  {
    ranking: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 6,
      },
    },
  },
  {
    sequelize,
    modelName: "UserSkill",
    tableName: "user_skills",
  }
);


// Associations
User.hasMany(Education, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(WorkExperience, { foreignKey: "user_id", onDelete: "CASCADE" });
Education.belongsTo(User, { foreignKey: "user_id" });
WorkExperience.belongsTo(User, { foreignKey: "user_id" });
User.belongsToMany(Skill, { through: UserSkill, foreignKey: "user_id" });
Skill.belongsToMany(User, { through: UserSkill, foreignKey: "skill_id" });

module.exports = { User, Education, WorkExperience, Skill };
