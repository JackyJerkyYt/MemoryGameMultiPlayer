#MemoryGameMultiPlayer
##What is this?
  - This is an upgraded version of my prior memory game full stack web app that I've been diligently developing.
  - The game functions by briefly displaying a set of tiles, after which players must recollect the displayed tiles in order to advance to the next level.

##New Features compared to the old version
  - Multiplayer Excitement:
    - Addressing feedback from friends who sometimes felt luck played a role, stemming from the random tile generation, I've now introduced an exhilarating multiplayer mode.
    - This mode enables head-to-head matches with friends, with both players confronting identical tile sequences. You can either host a room for your friend to join or join their hosted room.
    - Real-time scoring updates for each player intensify the competitive spirit of the game.
    - Rules: Correctly recalled tiles yield points, while choosing incorrectly results in a deduction of 15 points. The first player to reach a score below 0 loses, granting victory to the opponent.
  - Endless Levels:
    - In contrast to the previous version, this iteration boasts an infinite level progression. Successfully completing a level seamlessly propels you to the subsequent one, each presenting a progressively intricate set of tiles to remember.

##Technology used:
  - Leveraged React.js for both the web frontend design and comprehensive implementation of game mechanics
  - Utilized Node.js and Express.js to architect the backend. Establishing connection to MongoDB database to store player data
  - Integrated web sockets to enable multiplayer functionality, elevating competitiveness by displaying real-time opponent scores for an engaging gaming experience
  - Utilized: React.js, Node.js, Express.js, MongoDB, Web Socket
