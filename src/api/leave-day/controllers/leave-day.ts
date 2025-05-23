/**
 * leave-day controller
 */
"use strict";

import { factories } from "@strapi/strapi";
import { connect } from "http2";

export default factories.createCoreController("api::leave-day.leave-day", ({ strapi }) => ({
  async createLeave(ctx) {
    try {

      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("You must be logged in to access this!");
      }

      console.log("USER ", user);

      const { firstDay, lastDay } = ctx.request.body;

      if (!firstDay || !lastDay) {
        return ctx.badRequest("Missing required fields.");
      }

      // ✅ Step 1: Create Leave Request
      const leaveRequest = await strapi.entityService.create("api::leave-day.leave-day", {
        data: {
          firstDay,
          lastDay,
          addedAt: new Date().toISOString(),
          statusRequest: "Pending"
        },
      });

      // await strapi.entityService.update("plugin::users-permissions.user", user.id, {
      //   data: {
      //     leave_days: {
      //       connect: [{ id: leaveRequest.id }]
      //     },
      //   },
      // });

      await strapi.db.query("plugin::users-permissions.user").update({
        where: { id: user.id },
        data: {
          leave_days: {
            connect: [{ id: leaveRequest.id }],
          },
        },
      });

      const userWithLeaveDays = await strapi.entityService.findOne("plugin::users-permissions.user", user.id, {
        populate: ["leave_days"],
      });

      console.log("USER WITH LEAVE DAYS ",userWithLeaveDays);

      return ctx.send({ message: "Leave request submitted successfully!", leaveRequest });
    } catch (error) {
      strapi.log.error("❌ Error submitting leave request:", error);
      return ctx.internalServerError("Something went wrong. Check logs for details.");
    }
  },
}));
