// Story dialogue scripts. CINAR and ECEM are replaced at runtime with actual names.
const STORY = {
  intro: [
    { speaker: null,   text: 'Egypt, 1923. Two archaeologists have discovered a sealed pyramid deep in the desert...' },
    { speaker: 'CINAR', text: "Look at these hieroglyphs. They're a warning... 'Those who wake the Pharaoh shall face his wrath.'" },
    { speaker: 'ECEM',  text: 'We didn\'t come all this way to turn back now. Besides, I have my bow. And you have... that sword.' },
    { speaker: 'CINAR', text: 'A khopesh. And yes, together we can handle whatever is inside.' },
    { speaker: null,   text: 'A rumble shakes the ground. The pyramid entrance slides open on its own.' },
    { speaker: 'ECEM',  text: '...See? It was expecting us. How polite.' },
    { speaker: null,   text: 'Level 1 — Ecenin Gobus' }
  ],

  level1_mid: [
    { speaker: 'CINAR', text: 'These mummies move like they have purpose. Something is controlling them.' },
    { speaker: 'ECEM',  text: 'There — on the wall. An Ankh of Ra. If we collect the three pieces, the inscriptions say the curse breaks.' },
    { speaker: 'CINAR', text: 'Then we find all three. Together.' },
    { speaker: 'ECEM',  text: 'Obviously together. You would get lost without me.' },
    { speaker: 'CINAR', text: '...That is probably true.' }
  ],

  level1_boss_entry: [
    { speaker: null,   text: 'A colossal chamber opens before you. In the center, wrapped in a thousand bandages, stands the Gatekeeper.' },
    { speaker: 'ECEM',  text: 'That thing is enormous.' },
    { speaker: 'CINAR', text: 'Stay close. We fight as one.' }
  ],

  level1_complete: [
    { speaker: null,   text: 'The Gatekeeper crumbles. In its chest gleams the first piece of the Ankh of Ra.' },
    { speaker: 'ECEM',  text: 'One piece down. Two to go.' },
    { speaker: 'CINAR', text: 'The pyramid goes deeper. And it gets darker.' },
    { speaker: 'ECEM',  text: 'Good thing I brought you as a lamp.' },
    { speaker: null,   text: 'Level 2 — Cinar Gobus' }
  ],

  level2_entry: [
    { speaker: null,   text: 'You descend into the antechamber. The walls glow with cursed hieroglyphs. Traps lie in every shadow.' },
    { speaker: 'CINAR', text: 'Watch your step. The floor tiles cycle on and off. Spikes.' },
    { speaker: 'ECEM',  text: 'And there are pressure plates ahead. We need to stand on them at the same time.' },
    { speaker: 'CINAR', text: 'Like we do everything. At the same time.' }
  ],

  level2_puzzle: [
    { speaker: null,   text: 'Two ancient plates glow faintly in the chamber.' },
    { speaker: 'ECEM',  text: 'You take the left one. I\'ll take the right. On three.' },
    { speaker: 'CINAR', text: 'One... two...' },
    { speaker: 'ECEM',  text: 'Three!' },
    { speaker: null,   text: 'The sealed door grinds open.' }
  ],

  level2_boss_entry: [
    { speaker: null,   text: 'A ghostly figure materializes — the shade of Nephthys, guardian of the tomb.' },
    { speaker: null,   text: 'She speaks in a voice like wind through sand: "You should not be here..."' },
    { speaker: 'CINAR', text: 'We\'re here to break the curse on Pharaoh Khamun. Let us pass.' },
    { speaker: null,   text: 'The shade screams. The battle begins.' }
  ],

  level2_complete: [
    { speaker: null,   text: 'The shade fades. The second Ankh piece falls to the ground.' },
    { speaker: 'ECEM',  text: 'I saw something in the shade\'s eyes. Sadness. She was a prisoner too.' },
    { speaker: 'CINAR', text: 'Then we free her master. One more level.' },
    { speaker: null,   text: 'A ghostly vision of Pharaoh Khamun appears before you.' },
    { speaker: null,   text: '"Please... I beg you. My soul has been chained by Anubis for a thousand years. Break the Ankh\'s seal..."' },
    { speaker: 'ECEM',  text: 'We will. I promise.' },
    { speaker: null,   text: 'Level 3 — Gobuscukler' }
  ],

  level3_entry: [
    { speaker: null,   text: 'The grand throne room of Pharaoh Khamun. Gold everywhere. And a darkness that pulses like a heartbeat.' },
    { speaker: 'CINAR', text: 'The curse is strongest here. I can feel it.' },
    { speaker: 'ECEM',  text: 'We have two pieces of the Ankh. The third is here, in the throne room.' },
    { speaker: 'CINAR', text: 'Then let\'s earn it.' }
  ],

  level3_boss_entry: [
    { speaker: null,   text: 'The Pharaoh rises from his throne. His eyes glow with the purple fire of Anubis\'s curse.' },
    { speaker: null,   text: '"You dare disturb my eternal sleep? I will bury you with me."' },
    { speaker: 'ECEM',  text: 'Khamun! We\'re here to free you. Fight the curse!' },
    { speaker: null,   text: 'He raises his staff. A wave of dark energy fills the room.' },
    { speaker: 'CINAR', text: 'He cannot hear us. We have to break the curse by force. Strike the weak points!' }
  ],

  boss_phase2: [
    { speaker: null,   text: 'Khamun\'s form flickers. For a moment, his eyes clear.' },
    { speaker: null,   text: '"I... cannot stop... Use the Ankh... charge it... with the Wisps\' energy..."' },
    { speaker: 'ECEM',  text: 'The wisps! Defeat them to charge the Ankh!' }
  ],

  boss_phase3: [
    { speaker: null,   text: 'Khamun howls as the Ankh\'s power weakens his bonds. The curse fights back — the floor burns purple.' },
    { speaker: 'CINAR', text: 'Stay together! If we split, Anubis\'s shadow will take us!' },
    { speaker: 'ECEM',  text: 'Stay close to me. We finish this together!' }
  ],

  victory: [
    { speaker: null,   text: 'The final blow lands. Khamun staggers. The purple fire in his eyes fades.' },
    { speaker: null,   text: 'The Ankh of Ra, now whole, blazes with golden light. The curse shatters.' },
    { speaker: null,   text: 'Khamun smiles — for the first time in a thousand years.' },
    { speaker: null,   text: '"Thank you... I am free. Now RUN — the pyramid will not stand without my curse to hold it!"' },
    { speaker: 'ECEM',  text: 'RUN!' },
    { speaker: 'CINAR', text: 'I know! MOVE!' },
    { speaker: null,   text: 'The pyramid shakes. You have 60 seconds to escape...' }
  ],

  escape_complete: [
    { speaker: null,   text: 'You burst into the desert sunlight as the pyramid collapses behind you in a cloud of sand.' },
    { speaker: 'ECEM',  text: 'We did it.' },
    { speaker: 'CINAR', text: 'We did it.' },
    { speaker: null,   text: '...' },
    { speaker: 'ECEM',  text: 'I told you we could handle it.' },
    { speaker: 'CINAR', text: 'You tell me a lot of things.' },
    { speaker: 'ECEM',  text: 'And I am always right.' },
    { speaker: null,   text: 'THE END' },
    { speaker: null,   text: 'Made with love, for Cinar & Ecem. ♥' }
  ],

  game_over: [
    { speaker: null,   text: 'The darkness of the tomb claims you...' },
    { speaker: null,   text: 'But your story is not over.' }
  ]
};

module.exports = STORY;
