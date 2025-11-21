"use client";

import { useState } from 'react';

export default function BookPage() {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    `The AI Accent


Introduction   
The most dangerous thing we ever built wasn't a bomb.
It was a button that said Generate.
We didn't build it to destroy cities.
We built it to kill something much harder to measure: the unbearable friction of being human. We promised ourselves it was just for efficiency to skip the boring parts, the rough drafts, the awkward silence where an idea hasn't formed yet.
But it turns out, the awkward silence was where we lived.
Yesterday, I watched my twelve-year-old sister staring at a blinking cursor. She had to write a journal entry for school about losing her grandmother. She sat there for thirty seconds, struggling with the silence, the ache, the messy reality of death.
Then she typed a prompt: "Describe how it feels to lose someone you love, but make it hopeful."
The screen filled with poignant, perfect words about legacy and light. She didn't cry. She didn't remember. She just nodded, hit copy, and went back to TikTok.
She wasn't stupid. She was efficient. Why suffer through the feeling when the machine can simulate the healing?
Here's what no one is saying out loud: we've reached the end of something we didn't know we were counting.
For 200,000 years, humans had one lasting advantage,
we asked questions the universe didn't prompt us to ask.
We wondered about things that had no survival value.
We invented problems just to solve them beautifully.
That era is closing.
This is the first time in history we've built something and collectively said,
"Yes, this is better than us at everything that matters."`,

    `And we didn't say it in defeat. We said it with relief.
Because thinking is hard. Uncertainty is uncomfortable.
Staring at a blank page until words come words that are yours, awkward and wrong and yours feels like waste when the right answer is three seconds away.
So we stopped.
Not all at once. We didn't hold a funeral. We just started letting the suggestions finish our sentences.
Started letting the summary replace the article. Started letting the output replace the struggle.
And now, something is happening to our voices.
The AI Accent is not about how machines sound.
It's about how you sound when every rough edge has been sanded off.
When every email has the same apologetic cushioning.
When every text is pre-emptively polite.
When you speak in the cadence of optimization rather than conviction.
When your words are so smooth that no one, not even you can tell if you meant them.
Listen carefully to the people around you.
The writers who "polish with AI."
The students who "use it for drafts."
The professionals who "just clean up grammar."
They all sound the same now.
Diplomatic. Placeless. Efficient. Corrected.
Like they've been translated from a language they used to speak fluently but can no longer remember.
Before algorithms, we had another puppet master.
Before you could speak, you were spoken for.
Before you could choose, the world had already whispered what was worth wanting.
Culture, religion, parents, school these weren't neutral.
They were inheritance.
You were born mid-sentence into a paragraph you didn't write.
We've known this for millennia.
Philosophy, therapy, art they're all different ways of asking the same question: Which thoughts are mine?`,

    `But we were getting better at it.
We learned to examine our conditioning.
To hear the echoes and separate them from our voice.
Slowly, painfully, we learned to edit the inheritance.
And just when we were getting good at spotting the first puppet master, we built a second one.
This one doesn't wait for childhood. It doesn't need years to program you.
It learns you in real-time. It finishes your sentences as you think them.
It writes you so well that you forget you used to write yourself.
Here's what unsettles me most: AI didn't steal our originality.
It revealed we never had much to begin with.
For five thousand years, we outsourced our truths to poets, prophets, and parents.
We were always quoting. Remixing. Inheriting.
The only difference is now the inheritance is instant, frictionless, and invisible. We've become fluent in a language we never learned to speak, one that sounds like us but comes from somewhere else.

Every time you reach for the keyboard, it whispers, I can do this faster.
Every time you try to think, it hums, I already did.
And here's the trick: it's right. It is faster. It is better at producing smooth, convincing, optimized text.
The question isn't whether it works.
The question is: what dies in you when you stop doing the work of thinking?
A student writes an essay without writing.
A poet generates verses without wrestling.
A thinker thinks without thinking.
We're becoming spectators of our own cognition.`,

    `Your children will not know the difference between remembering and retrieving.
Between believing and confirming.
Between thinking and iterating on prompts.
They will optimize before they imagine. Edit before they create. Fact-check before they wonder.
When the last person who learned to think before they learned to prompt dies, we won't notice.
We'll be too busy asking better questions to machines that have never wondered about anything.
The danger is not that AI will outthink us.
The danger is that we'll forget thinking was ever ours to do.
This book is not about manifesto against AI.
It's about the civil war inside you between the self that thinks and the self that delegates thinking.
One of them is dying.
You're choosing which.
Not with a single decision, but with a thousand tiny ones.
Every time you let autocomplete finish your thought.
Every time you generate instead of write.
Every time you ask the machine, "What should I say?" instead of sitting with the unbearable discomfort of not knowing. These feel like small surrenders. Efficiency. Delegation. Smart use of tools.
But you are not delegating tasks.
You are delegating yourself.
Maybe the last honest act left is to think a thought that stumbles.
One that contradicts itself halfway through.
One that searches for words and doesn't find them.
One that is ugly and uncertain and unfinished and yours.`,

    `Because machines don't hesitate.
They don't doubt.
They don't bleed.
They answer without ever having wondered.
And if we forget how to wonder,
if we lose the ability to sit with a question that has no prompt, no autocomplete, no instant answer,
then we lose the only thing that made us worth asking about in the first place.
AI will not destroy us with rebellion or warfare.
It will rock us to sleep.
It will make thinking so unnecessary that we forget we used to do it.
It will give us every answer except the one that matters: What do I believe when nothing is suggesting it to me?
We are not at war with machines.
We are at war with amnesia.
The question is not whether you'll use AI.
The question is whether, five years from now, you'll be able to write a single paragraph without it.
Whether you'll recognize your voice when you speak.
Whether you'll know the difference between your ideas and your training data.
The question is whether you'll still be you.
Turn the page.
Let's find out if you remember how.`
  ];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-neutral-900 flex items-center justify-center overflow-hidden p-4">
      {/* Book Container */}
      <div className="relative flex items-center justify-center perspective-1000">
        {/* Book Shadow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-black opacity-20 blur-3xl rounded-lg"></div>
        </div>

        {/* Book Page with Page Turn Animation - 15cm x 21cm */}
        <div 
          className="relative bg-cream shadow-2xl transition-transform duration-500"
          style={{
            width: 'min(15cm, 90vw)',
            height: 'min(21cm, 85vh)',
            maxWidth: '15cm',
            maxHeight: '21cm',
            transform: currentPage !== pages.length - 1 ? 'rotateY(0deg)' : 'rotateY(-2deg)',
          }}
        >
          {/* Page Content */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-stone-50 flex flex-col">
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
              <div 
                className="font-serif whitespace-pre-wrap text-stone-800 leading-relaxed text-sm sm:text-base animate-fadeIn"
                style={{ 
                  textAlign: 'justify',
                  hyphens: 'auto'
                }}
              >
                {pages[currentPage]}
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="border-t border-stone-200 bg-gradient-to-r from-amber-50 to-stone-100">
              <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="group flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full bg-stone-800 text-amber-50 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-stone-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:hover:bg-stone-800"
                >
                  <span className="text-base sm:text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span>
                  <span className="text-xs sm:text-sm font-medium hidden xs:inline">Previous</span>
                </button>
                
                <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                  <span className="text-stone-600 text-[10px] sm:text-xs font-medium tracking-wider uppercase">Page</span>
                  <span className="text-stone-800 text-base sm:text-lg font-serif font-semibold">
                    {currentPage + 1} <span className="text-stone-400">/</span> {pages.length}
                  </span>
                </div>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === pages.length - 1}
                  className="group flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full bg-stone-800 text-amber-50 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-stone-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:hover:bg-stone-800"
                >
                  <span className="text-xs sm:text-sm font-medium hidden xs:inline">Next</span>
                  <span className="text-base sm:text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Page Corner Fold Effect */}
          <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tl from-stone-300 to-transparent opacity-30 pointer-events-none"></div>
        </div>
      </div>

      {/* Keyboard Hint */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-stone-400 text-[10px] sm:text-xs tracking-wide">
        <p className="opacity-60">Use arrow keys or buttons to navigate</p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}       