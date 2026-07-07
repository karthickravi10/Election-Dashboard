/**
 * ==========================================================================
 * DEMO / PLACEHOLDER DATA — window.ED_SAMPLE
 * --------------------------------------------------------------------------
 * This file exists ONLY because the real Excel datasets for Past Election
 * Results, Political Leaders, Constituency Insights, Boundary Images, and
 * the five description types were not available yet.
 *
 * It covers 3 constituencies (Nippani, Chikkodi-Sadalga, Athani) so every
 * new UI section has something real to render and can be visually
 * reviewed. Every other constituency will correctly show this dashboard's
 * "no data available yet" empty states — that's intentional, and is the
 * required graceful-missing-data behavior from §12, not a bug.
 *
 * TO GO LIVE WITH REAL DATA:
 *   Replace the arrays/objects below with your actual dataset content
 *   (same shape), OR point js/config/datasetManifest.js `source` at a
 *   fetchable .xlsx/.csv/.json URL instead of this embedded object.
 *   No component code needs to change either way.
 * ==========================================================================
 */
window.ED_SAMPLE = {

  // §4/§15 — Past Election Results / Timeline. Many rows per AC.
  pastElections: [
    { acName: 'Nippani', year: 2024, electionType: 'General Election', winner: 'Annasaheb Jolle', winnerParty: 'BJP', runnerUp: 'Satish Jarkiholi', runnerUpParty: 'INC', margin: '85,000', voteShare: '54.2%' },
    { acName: 'Nippani', year: 2019, electionType: 'General Election', winner: 'Annasaheb Jolle', winnerParty: 'BJP', runnerUp: 'Ganesh Hukkeri', runnerUpParty: 'INC', margin: '1,17,000', voteShare: '58.1%' },
    { acName: 'Nippani', year: 2018, electionType: 'Assembly Election', winner: 'Shashikala Jolle', winnerParty: 'BJP', runnerUp: 'Kakasaheb Patil', runnerUpParty: 'INC', margin: '32,400', voteShare: '49.6%' },
    { acName: 'Nippani', year: 2014, electionType: 'General Election', winner: 'Prakash Hukkeri', winnerParty: 'INC', runnerUp: 'Suresh Angadi', runnerUpParty: 'BJP', margin: '9,200', voteShare: '46.8%' },
    { acName: 'Nippani', year: 2013, electionType: 'Assembly Election', winner: 'Kakasaheb Patil', winnerParty: 'INC', runnerUp: 'Shashikala Jolle', runnerUpParty: 'BJP', margin: '5,600', voteShare: '44.3%' },

    { acName: 'Chikkodi-Sadalga', year: 2024, electionType: 'General Election', winner: 'Priyanka Jarkiholi', winnerParty: 'INC', runnerUp: 'Annasaheb Jolle', runnerUpParty: 'BJP', margin: '62,000', voteShare: '52.9%' },
    { acName: 'Chikkodi-Sadalga', year: 2019, electionType: 'General Election', winner: 'Annasaheb Jolle', winnerParty: 'BJP', runnerUp: 'Satish Jarkiholi', runnerUpParty: 'INC', margin: '95,300', voteShare: '55.4%' },
    { acName: 'Chikkodi-Sadalga', year: 2018, electionType: 'Assembly Election', winner: 'Ganesh Hukkeri', winnerParty: 'INC', runnerUp: 'Ramesh Katti', runnerUpParty: 'BJP', margin: '18,750', voteShare: '47.1%' },
  ],

  // §6/§16 — Important Political Leaders. Many rows per AC.
  leaders: [
    { acName: 'Nippani', name: 'Smt Shashikala Jolle', party: 'BJP', position: 'Sitting MLA', community: 'Lingayat', designation: 'Cabinet Minister (former)', bio: 'Long-serving legislator with a strong organizational base across Chikkodi taluk.', photoUrl: '', status: 'Active' },
    { acName: 'Nippani', name: 'Uttam Raosaheb Patil', party: 'NCP', position: 'Former MLA', community: 'Jain', designation: 'District Unit President', bio: 'Prominent local leader with influence in the sugar-cooperative sector.', photoUrl: '', status: 'Active' },
    { acName: 'Chikkodi-Sadalga', name: 'Ganesh Hukkeri', party: 'INC', position: 'Sitting MLA', community: 'Lingayat', designation: 'MLA', bio: 'Represents the constituency with a focus on irrigation and agrarian issues.', photoUrl: '', status: 'Active' },
    { acName: 'Athani', name: 'Mahesh Kumathalli', party: 'BJP', position: 'Sitting MLA', community: 'Lingayat', designation: 'MLA', bio: 'Known for cross-border trade advocacy along the Maharashtra boundary.', photoUrl: '', status: 'Active' },
  ],

  // §7/§17 — Constituency Insights (one intelligence-report record per AC).
  insights: [
    {
      acName: 'Nippani',
      politicalLandscape: 'A traditionally BJP-leaning seat with a strong Lingayat-Jolle family presence, though NCP retains a committed base among sugar-belt cooperatives.',
      majorCommunities: ['Maratha (29.55%)', 'Lingayat (20%)', 'SC (15.71%)', 'Jain (9.57%)'],
      majorCohorts: ['Sugarcane farmers', 'Border-trade merchants (Maharashtra frontier)', 'Cooperative society members'],
      votingBehaviour: 'Consolidated bloc voting along caste-cooperative lines; swing concentrated among younger Maratha voters in urban Nippani town.',
      keyInfluencers: ['Jolle family network', 'Sugar cooperative society heads', 'Local Jain trader associations'],
      developmentIssues: ['Border-area road connectivity', 'Sugarcane price/FRP disputes', 'Flood-prone belt along Krishna tributary'],
      electionChallenges: ['Anti-incumbency at booth level in urban wards', 'NCP-INC vote consolidation risk'],
      organizationalStrength: 'High — well-networked booth committees inherited from long incumbency.',
      campaignOpportunities: ['Sugarcane FRP advocacy', 'Border-trade infrastructure announcements'],
      strategicRecommendations: ['Shore up urban Maratha youth outreach', 'Preempt cooperative-sector grievances before season'],
      futureOutlook: 'Likely to remain competitive but BJP-favored absent a unified opposition candidate.',
    },
    {
      acName: 'Chikkodi-Sadalga',
      politicalLandscape: 'Swing seat between INC and BJP, tracking closely with the parent Chikkodi PC contest.',
      majorCommunities: ['Lingayat', 'Maratha', 'SC/ST'],
      majorCohorts: ['Dairy farmers', 'Textile workers'],
      votingBehaviour: 'Split-ticket voting common between assembly and general elections.',
      keyInfluencers: ['Hukkeri family', 'Dairy cooperative leadership'],
      developmentIssues: ['Milk procurement pricing', 'Irrigation canal maintenance'],
      electionChallenges: ['Close historical margins increase volatility'],
      organizationalStrength: 'Moderate — contested ground with active booth-level presence on both sides.',
      campaignOpportunities: ['Dairy sector support schemes'],
      strategicRecommendations: ['Early booth-level mapping given tight historical margins'],
      futureOutlook: 'Genuine toss-up; outcome likely tracks state-level mood.',
    },
  ],

  // §2/§13 — Assembly Boundary Images (one per AC).
  // NOTE: these are placeholder image URLs and will only load when the
  // dashboard is deployed online (not over file://) — the boundary image
  // component falls back to a local placeholder graphic either way.
  boundaryImages: [
    { acName: 'Nippani', imageUrl: 'https://placehold.co/900x560/1F2937/FFFFFF?text=Nippani+%28AC+1%29+Boundary+Map' },
    { acName: 'Chikkodi-Sadalga', imageUrl: 'https://placehold.co/900x560/1F2937/FFFFFF?text=Chikkodi-Sadalga+%28AC+2%29+Boundary+Map' },
    { acName: 'Athani', imageUrl: 'https://placehold.co/900x560/1F2937/FFFFFF?text=Athani+%28AC+3%29+Boundary+Map' },
  ],

  // §5 — Descriptions for the clickable info widgets.
  descriptions: {
    ac: [
      { acName: 'Nippani', title: 'Nippani Assembly Constituency', body: 'Nippani sits on the Karnataka–Maharashtra border and has historically been shaped by the sugarcane economy and cross-border trade.', historicalBackground: 'Formed as part of the post-reorganization Belagavi district assembly map.', politicalImportance: 'A bellwether for BJP-NCP dynamics in the border belt.', demographicProfile: 'Maratha-plurality with significant Lingayat and Jain populations.', economicProfile: 'Sugarcane cultivation, jaggery trade, and border commerce.', keyIssues: 'FRP pricing, flood management, road connectivity to Maharashtra markets.', importantLocations: 'Nippani APMC yard, Krishna river belt villages.', adminInfo: 'Part of Chikkodi taluk, Belagavi district.' },
      { acName: 'Chikkodi-Sadalga', title: 'Chikkodi-Sadalga Assembly Constituency', body: 'A dairy and textile hub within the larger Chikkodi parliamentary constituency.', historicalBackground: 'One of the more closely contested seats in the district over the last three cycles.', politicalImportance: 'Seen as an early indicator for the parent PC contest.', demographicProfile: 'Mixed Lingayat-Maratha-SC/ST composition.', economicProfile: 'Dairy cooperatives and small-scale textile units.', keyIssues: 'Milk procurement pricing, irrigation canal upkeep.', importantLocations: 'Sadalga dairy cooperative complex.', adminInfo: 'Part of Chikkodi taluk, Belagavi district.' },
    ],
    pc: [
      { pc: 'Chikkodi', title: 'Chikkodi Parliamentary Constituency', body: 'A border constituency covering multiple sugar-belt assembly segments, historically contested between BJP and INC/NCP alliances.', keyIssues: 'Sugarcane pricing policy, interstate water-sharing disputes.' },
    ],
    district: [
      { district: 'Belagavi', title: 'Belagavi District', body: 'A large border district with a mixed Kannada-Marathi linguistic population and a strong agrarian economy.', keyIssues: 'Border-area linguistic politics, sugar-belt economics.' },
    ],
    orgDistrict: [
      { orgDistrict: 'Chikkodi', title: 'Chikkodi Organizational District', body: 'Party organizational unit covering the Chikkodi PC segment of Belagavi district.' },
    ],
    zone: [
      { zone: 'Kittur', title: 'Kittur Zone', body: 'A historically significant zone named for the Kittur princely state, spanning several sugar-belt assembly segments.' },
    ],
  },
};
