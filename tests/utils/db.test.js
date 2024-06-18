import dbClient from '../../utils/db';

describe('+ DBClient utility', () => {
  before(function (done) {
    this.timeout(10000); // Set a timeout of 10 seconds for before hook
    
    // Ensure both usersCollection and filesCollection are cleaned before tests
    Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
      .then(([usersCollection, filesCollection]) => {
        // Delete all documents in both collections
        Promise.all([usersCollection.deleteMany({}), filesCollection.deleteMany({})])
          .then(() => done()) // Signal that cleanup is done
          .catch((deleteErr) => done(deleteErr)); // Handle errors in deletion
      }).catch((connectErr) => done(connectErr)); // Handle errors in connection
  });

  // Test if the DBClient is connected and alive
  it('+ Client is alive', () => {
    expect(dbClient.isAlive()).to.equal(true); // Assert that DBClient is alive
  });

  // Test if nbUsers method returns the correct number of users (0 initially)
  it('+ nbUsers returns the correct value', async () => {
    expect(await dbClient.nbUsers()).to.equal(0); // Assert that nbUsers returns 0 users
  });

  // Test if nbFiles method returns the correct number of files (0 initially)
  it('+ nbFiles returns the correct value', async () => {
    expect(await dbClient.nbFiles()).to.equal(0); // Assert that nbFiles returns 0 files
  });
});
