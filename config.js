/**
 * ==========================================================================
 * PORTFOLIO CONFIGURATION (config.js)
 * ==========================================================================
 * Single central place for all profile URLs, project repositories, live demos,
 * contact details, and external links across the entire website.
 *
 * To update any URL in the future, simply edit it here!
 */

const PORTFOLIO_CONFIG = {
  personal: {
    name: "Tanish Pal",
    title: "Software Engineer",
    email: "tanish.pal.biz@gmail.com",
    phone: "+91-7009890319",
    location: "Punjab, India"
  },

  social: {
    github: "https://github.com/Tanishpal23",
    linkedin: "https://shorturl.at/V8bXN",
    leetcode: "https://leetcode.com/u/Tech_tonic/",
    gfg: "https://www.geeksforgeeks.org/profile/tanishhh22xz1"
  },

  projects: {
    coreBanking: {
      name: "Core Banking System",
      codeUrl: "https://github.com/Tanishpal23/Banking-System",
      demoUrl: "https://www.onlinegdb.com/MV9SF_PEn"
    },
    mockMate: {
      name: "Mock Mate",
      codeUrl: "https://github.com/Tanishpal23/Ai-Interiew-Mocker",
      demoUrl: "https://mockmate-gamma.vercel.app/"
    },
    knowYourProduct: {
      name: "KnowYourProduct",
      codeUrl: "https://github.com/Tanishpal23/knowyourproduct",
      demoUrl: "https://knowyourproduct-wine.vercel.app/"
    },
    chessAnalyzer: {
      name: "ChessAnalyzer",
      codeUrl: "https://github.com/Tanishpal23/ChessAnalyzer",
      demoUrl: "https://chess-analyzer-pearl.vercel.app/"
    },
    salesDashboard: {
      name: "Sales Performance Dashboard",
      codeUrl: "https://github.com/Tanishpal23/PowerBiPro",
      demoUrl: "https://github.com/Tanishpal23/PowerBiPro"
    },
    nexMeet: {
      name: "NexMeet",
      codeUrl: "https://github.com/Tanishpal23",
      demoUrl: "https://nex-meet-beta.vercel.app/"
    },
    brainly: {
      name: "Brainly",
      codeUrl: "https://github.com/Tanishpal23",
      demoUrl: "https://brainly-ko1p.vercel.app/"
    }
  }
};

// Support CommonJS export if used in Node.js test scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PORTFOLIO_CONFIG;
}
