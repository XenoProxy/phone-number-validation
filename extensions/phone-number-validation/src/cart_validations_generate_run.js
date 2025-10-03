// @ts-check

/**
 * @typedef {import("../generated/api").CartValidationsGenerateRunInput} CartValidationsGenerateRunInput
 * @typedef {import("../generated/api").CartValidationsGenerateRunResult} CartValidationsGenerateRunResult
 */

/**
 * @typedef {Object} DeliveryAddress
 * @property {string | null} [phone]
 */

/**
 * @typedef {Object} DeliveryGroup
 * @property {DeliveryAddress | null} [deliveryAddress]
 */

/**
 * @typedef {Object} Cart
 * @property {DeliveryGroup[]} deliveryGroups
 */


/**
 * @param {CartValidationsGenerateRunInput & { cart: Cart }} input
 * @returns {CartValidationsGenerateRunResult}
 */
export function cartValidationsGenerateRun(input) {
  const errors = [];

  for (const group of input.cart.deliveryGroups) {
    if (!group.deliveryAddress) continue;
    // const deliveryGroup = input.cart?.deliveryGroups?.[0];
    const phoneNumber = group.deliveryAddress?.phone;
    if (!phoneNumber || phoneNumber.trim() === "") {
      errors.push({
        target: "$.cart.deliveryGroups[0].deliveryAddress.phone",
        message: "Поле «Телефон» является обязательным для оформления заказа."
      });
    } else {
      // 2. Убираем все нецифровые символы и проверяем длину
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      
      if (digitsOnly.length !== 10) {
        errors.push({
          target: "$.cart.deliveryGroups[0].deliveryAddress.phone",
          message: "Телефонный номер должен содержать минимум 10 цифр (включая код страны)."
        });
      }

      if (!digitsOnly.startsWith("05")) {
      errors.push({
        target: "$.cart.deliveryGroups[0].deliveryAddress.phone",
        message: "Телефонный номер должен начинаться с '05'."
      });
      }
    }
  }

  const operations = [
    {
      validationAdd: {
        errors
      },
    },
  ];

  return { operations };

};

// export function cartValidationsGenerateRun(input) {
//   const errors = input.cart.lines
//     .filter(({ quantity }) => quantity > 1)
//     .map(() => ({
//       message: "Not possible to order more than one of each",
//       target: "$.cart",
//     }));

//   const operations = [
//     {
//       validationAdd: {
//         errors
//       },
//     },
//   ];

//   return { operations };
// };