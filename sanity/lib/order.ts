export default {
    name: "order",
    type: "document",
    title: "Order",
    fields: [
      {
        name: "firstName",
        title: "First Name",
        type: "string",
      },
      {
        name: "lastName",
        title: "Last Name",
        type: "string",
      },
      {
        name: "address",
        title: "Address",
        type: "string",
      },
      {
        name: "province",
        title: "Province",
        type: "string",
      },
      {
        name: "phone",
        title: "Phone",
        type: "string", // Changed from "number" to "string" to allow leading zeros
      },
      {
        name: "email",
        title: "Email",
        type: "string",
      },
      {
        name: "zipCode",
        title: "Zip Code",
        type: "string", // Changed from "number" to "string" for better flexibility
      },
      {
        name: "city",
        title: "City",
        type: "string",
      },
      {
        name: "cartItems",
        title: "Cart Items",
        type: "array",
        of: [
          {
            type: "reference",
            to: { type: "product" },
          },
        ],
      },
      {
        name: "total",
        title: "Total",
        type: "number",
      },
      {
        name: "discount",
        title: "Discount",
        type: "number",
      },
      {
        name: "orderDate",
        title: "Order Date",
        type: "datetime",
        initialValue: new Date().toISOString(),
      },
      {
        name: "status",
        title: "Status",
        type: "string",
        options: {
          list: [
            { title: "Pending", value: "pending" },
            { title: "Success", value: "success" }, // Fixed typo "sucess" → "success"
            { title: "Dispatched", value: "dispatch" }, // Fixed typo "vale" → "value"
          ],
          layout: "radio", // Can change to dropdown if preferred
        },
        initialValue: "pending", // Default order status
      },
    ],
  };
  