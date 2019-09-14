const faker = require('faker');

module.exports.generateReviewsAndRatings = (fromId, toId) => {
  const reviews = [];
  const ratings = [];

  for (let id = fromId; id <= toId; id += 1) {
    const title = faker.commerce.productName();
    const review = faker.lorem.paragraph();
    const quality = faker.random.number({ min: 1, max: 5 });
    const sizing = faker.random.number({ min: 1, max: 5 });
    const style = faker.random.number({ min: 1, max: 5 });
    const value = faker.random.number({ min: 1, max: 5 });
    const comfort = faker.random.number({ min: 1, max: 5 });
    const customerName = faker.internet.userName();
    const purchaseDate = faker.date.recent();
    const productId = faker.random.number({ min: 1, max: 100 });
    const helpful = faker.random.boolean();
    const recommend = faker.random.boolean();

    //const overall = faker.random.number({ min: 1, max: 5 });

    // pass primary key to match ratings foreign key
    reviews.push({
      id,
      title,
      review,
      customerName,
      purchaseDate,
      productId,
      helpful,
      recommend
    });

    const overall = Math.floor((quality + sizing + style + value + comfort) / 5);

    ratings.push({
      id,
      reviewId: id,
      overall,
      quality,
      sizing,
      style,
      value,
      comfort
    });
  }
  return { reviews: reviews, ratings: ratings };
};

