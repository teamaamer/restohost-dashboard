import mysql from 'mysql2/promise'

async function initDatabase() {
  console.log('🔧 Initializing database...')

  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3303,
    user: 'root',
    password: '',
    multipleStatements: true,
  })

  try {
    // Create database
    await connection.query('CREATE DATABASE IF NOT EXISTS restaurant_analytics')
    console.log('✅ Database created')

    await connection.query('USE restaurant_analytics')

    // Create Restaurant table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Restaurant (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        brand VARCHAR(191) NULL,
        phone VARCHAR(191) NULL,
        timezone VARCHAR(191) NOT NULL DEFAULT 'Asia/Hebron',
        externalId VARCHAR(191) NULL UNIQUE,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX Restaurant_externalId_idx(externalId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ Restaurant table created')

    // Create Call table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`Call\` (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        restaurantId VARCHAR(191) NOT NULL,
        startedAt DATETIME(3) NOT NULL,
        endedAt DATETIME(3) NOT NULL,
        durationSeconds INT NOT NULL,
        callerPhone VARCHAR(191) NOT NULL,
        callerName VARCHAR(191) NULL,
        transcriptText LONGTEXT NOT NULL,
        summaryText LONGTEXT NULL,
        outcome ENUM('ORDER_PLACED', 'INQUIRY', 'MISSED', 'CANCELED', 'OTHER') NOT NULL,
        recordingUrl VARCHAR(191) NULL,
        isRecorded BOOLEAN NOT NULL DEFAULT false,
        externalId VARCHAR(191) NULL UNIQUE,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX Call_restaurantId_startedAt_idx(restaurantId, startedAt),
        INDEX Call_externalId_idx(externalId),
        CONSTRAINT Call_restaurantId_fkey FOREIGN KEY (restaurantId) REFERENCES Restaurant(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ Call table created')

    // Create Order table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`Order\` (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        callId VARCHAR(191) NULL,
        restaurantId VARCHAR(191) NOT NULL,
        orderType ENUM('PICKUP', 'DELIVERY') NOT NULL,
        paymentMethod ENUM('CASH', 'CARD', 'ONLINE', 'OTHER', 'UNKNOWN') NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        tax DECIMAL(10, 2) NOT NULL,
        tip DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status ENUM('PLACED', 'CANCELED', 'FAILED', 'NEEDS_FOLLOWUP') NOT NULL,
        customerName VARCHAR(191) NULL,
        customerPhone VARCHAR(191) NULL,
        externalId VARCHAR(191) NULL UNIQUE,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX Order_restaurantId_createdAt_idx(restaurantId, createdAt),
        INDEX Order_callId_idx(callId),
        INDEX Order_externalId_idx(externalId),
        CONSTRAINT Order_callId_fkey FOREIGN KEY (callId) REFERENCES \`Call\`(id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT Order_restaurantId_fkey FOREIGN KEY (restaurantId) REFERENCES Restaurant(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ Order table created')

    // Create OrderItem table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS OrderItem (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        orderId VARCHAR(191) NOT NULL,
        itemName VARCHAR(191) NOT NULL,
        quantity INT NOT NULL,
        unitPrice DECIMAL(10, 2) NULL,
        modifiersJson JSON NULL,
        INDEX OrderItem_orderId_idx(orderId),
        CONSTRAINT OrderItem_orderId_fkey FOREIGN KEY (orderId) REFERENCES \`Order\`(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ OrderItem table created')

    console.log('🎉 Database initialization complete!')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    throw error
  } finally {
    await connection.end()
  }
}

initDatabase()
  .then(() => {
    console.log('✨ All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
