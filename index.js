const keep_alive = require('./keep_alive.js');

const {bindCommandHandler, bindModalSubmissionHandler, bindButtonHandler, startClient} = require('./utils/discord_wrapper.js');


const c_req = require('./interactions/commands/req.js');
const c_refresh = require('./interactions/commands/refresh.js');

const m_request = require('./interactions/modals/request.js');
const m_reviewAndSend = require('./interactions/modals/review_and_send.js');
const m_reviewAndDiscard = require('./interactions/modals/review_and_discard.js');
const m_discard = require('./interactions/modals/discard.js');

const b_reviewAndSend = require('./interactions/buttons/review_and_send.js');
const b_reviewAndDiscard = require('./interactions/buttons/review_and_discard.js');
const b_send = require('./interactions/buttons/send.js');
const b_discard = require('./interactions/buttons/discard.js');
const b_robSentR = require('./interactions/buttons/rob_sent_rate');
const b_robSentF = require('./interactions/buttons/rob_sent_feat');
const b_robDiscarded = require('./interactions/buttons/rob_discarded.js');


//require('./deploy_commands.js');


bindCommandHandler('req', c_req.handle);
bindCommandHandler('refresh', c_refresh.handle);

bindModalSubmissionHandler('reqModal', m_request.handle);
bindModalSubmissionHandler('rnsModal', m_reviewAndSend.handle);
bindModalSubmissionHandler('rndModal', m_reviewAndDiscard.handle);
bindModalSubmissionHandler('dModal', m_discard.handle);

bindButtonHandler('rnsBtn', b_reviewAndSend.handle);
bindButtonHandler('rndBtn', b_reviewAndDiscard.handle);
bindButtonHandler('sBtn', b_send.handle);
bindButtonHandler('dBtn', b_discard.handle);
bindButtonHandler('robSentRBtn', b_robSentR.handle);
bindButtonHandler('robSentFBtn', b_robSentF.handle);
bindButtonHandler('robDiscardedBtn', b_robDiscarded.handle);


startClient();
