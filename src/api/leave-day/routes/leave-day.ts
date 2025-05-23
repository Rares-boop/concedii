/**
 * leave-day router
 */
import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::leave-day.leave-day");

// ✅ Define custom routes separately
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/leave-days/add",
      handler: "leave-day.createLeave", // Match the controller name correctly
      config: { policies: [] },
    },
  ],
};
