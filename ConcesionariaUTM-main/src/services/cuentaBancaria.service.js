const CuentaBancaria = require('../models/cuenta.models');

const obtenerCuentaBancariaPorUsuario = async (id_usuario) => {
  return await CuentaBancaria.findOne({ where: { id_usuario } });
};

const obtenerCuentaPorPersonaBancoNumero = async (id_persona, id_banco, numero_cuenta) => {
  return await CuentaBancaria.findOne({
    where: {
      id_persona,
      id_banco,
      numero_cuenta
    }
  });
};

const obtenerPorPersonaYBanco = async (id_persona, id_banco, numero_cuenta) => {
  return await CuentaBancaria.findOne({
    where: {
      id_persona,
      id_banco,
      numero_cuenta
    }
  });
};

module.exports = {
  obtenerCuentaBancariaPorUsuario,
  obtenerCuentaPorPersonaBancoNumero,
  obtenerPorPersonaYBanco
};
