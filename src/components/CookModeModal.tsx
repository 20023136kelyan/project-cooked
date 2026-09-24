import React, { useState, useEffect, useCallback } from 'react';
import { Recipe } from '../types/recipe';
import { playTimerAlarm } from '../utils/sound';
import { convertIngredientUnit, UnitSystem } from '../utils/units';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  CheckCircle, 
  Lightbulb, 
  UtensilsCrossed, 
  Sparkles,
  Volume2,
  VolumeX,
  List
} from 'lucide-react';

interface CookModeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CookModeModal: React.FC<CookModeModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !recipe) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    return (localStorage.getItem('cooked_unit_system') as UnitSystem) || 'us';
  });

  // Timer state for current step
  const currentStep = recipe.steps[currentStepIndex];
  const initialSeconds = currentStep?.timerSeconds || 0;
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);

  // Synchronize timer when step changes
  useEffect(() => {
    const step = recipe.steps[currentStepIndex];
    const sec = step?.timerSeconds || 0;
    setTimeLeft(sec);
    setTimerRunning(false);
    setTimerFinished(false);
  }, [currentStepIndex, recipe]);

  // Timer interval hook
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            setTimerFinished(true);
            playTimerAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowRight') {
      if (currentStepIndex < recipe.steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsCompleted(true);
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentStepIndex > 0) {
        setCurrentStepIndex((prev) => prev - 1);
      }
    } else if (e.key === ' ' && currentStep?.timerSeconds) {
      e.preventDefault();
      setTimerRunning((prev) => !prev);
    }
  }, [currentStepIndex, recipe.steps.length, currentStep, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `Step ${currentStep.stepNumber}. ${currentStep.instruction}. ${currentStep.tip ? `Chef tip: ${currentStep.tip}` : ''}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentStepIndex, isOpen]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((currentStepIndex + 1) / recipe.steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col select-none overflow-hidden">
      {/* Top Bar */}
      <header className="px-4 sm:px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white/90 dark:bg-zinc-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white font-display line-clamp-1">
              {recipe.title}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Cook Mode &bull; Step {currentStepIndex + 1} of {recipe.steps.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Ingredients Sheet Toggle */}
          <button
            type="button"
            onClick={() => setShowIngredients(!showIngredients)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              showIngredients
                ? 'bg-brand-600 text-white'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ingredients</span>
          </button>

          {/* Close Cook Mode */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-400 dark:hover:text-white transition-colors"
            title="Exit Cook Mode (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-brand-500 to-amber-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Body */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Step Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-8 sm:py-12 flex flex-col justify-between max-w-4xl mx-auto w-full">
          {!isCompleted ? (
            <div className="space-y-8 my-auto">
              {/* Step indicator badge & Voice Narration */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 dark:bg-brand-950/80 dark:border-brand-800/60 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
                  <span>Step {currentStep.stepNumber} of {recipe.steps.length}</span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleSpeech}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSpeaking
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700 animate-pulse'
                      : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700'
                  }`}
                  title="Read step instructions aloud"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />}
                  <span>{isSpeaking ? 'Stop Reading' : 'Speak Step'}</span>
                </button>
              </div>

              {/* Big instruction text */}
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display text-zinc-900 dark:text-white leading-tight">
                  {currentStep.instruction}
                </h3>

                {currentStep.tip && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-200 flex items-start gap-3 text-sm max-w-2xl">
                    <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-800 dark:text-amber-300">Chef's Secret: </span>
                      {currentStep.tip}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Timer (If Step Has Timer) */}
              {currentStep.timerSeconds && (
                <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800/90 max-w-md shadow-xl space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-brand-500" />
                      <span>Cooking Timer</span>
                    </div>
                    {timerFinished && (
                      <span className="text-emerald-500 font-bold animate-pulse">
                        Time's up!
                      </span>
                    )}
                  </div>

                  {/* Large Digital Clock */}
                  <div className="flex items-baseline justify-center gap-2 py-2">
                    <span className={`text-6xl sm:text-7xl font-mono font-bold tracking-tight ${
                      timerFinished 
                        ? 'text-emerald-500 animate-bounce' 
                        : timerRunning 
                          ? 'text-brand-500' 
                          : 'text-zinc-800 dark:text-zinc-200'
                    }`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center justify-center gap-3">
                    {/* -1 min */}
                    <button
                      type="button"
                      onClick={() => setTimeLeft((t) => Math.max(0, t - 60))}
                      className="p-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-transparent dark:text-zinc-300"
                      title="-1 Minute"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    {/* Start / Pause */}
                    <button
                      type="button"
                      onClick={() => {
                        if (timerFinished) {
                          setTimeLeft(currentStep.timerSeconds || 60);
                          setTimerFinished(false);
                          setTimerRunning(true);
                        } else {
                          setTimerRunning(!timerRunning);
                        }
                      }}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-transform active:scale-95 ${
                        timerRunning
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30'
                      }`}
                    >
                      {timerRunning ? (
                        <>
                          <Pause className="w-4 h-4 fill-white" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span>{timerFinished ? 'Restart' : 'Start Timer'}</span>
                        </>
                      )}
                    </button>

                    {/* +1 min */}
                    <button
                      type="button"
                      onClick={() => setTimeLeft((t) => t + 60)}
                      className="p-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-transparent dark:text-zinc-300"
                      title="+1 Minute"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Reset */}
                    <button
                      type="button"
                      onClick={() => {
                        setTimerRunning(false);
                        setTimeLeft(currentStep.timerSeconds || 0);
                        setTimerFinished(false);
                      }}
                      className="p-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-transparent dark:text-zinc-400 dark:hover:text-zinc-200"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Completed Celebration Screen */
            <div className="text-center py-12 space-y-6 my-auto max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center mx-auto text-white shadow-xl shadow-brand-500/20">
                <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '8s' }} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
                  Dish Completed!
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-zinc-900 dark:text-white">
                  Bon Appétit!
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  You successfully cooked <span className="text-brand-600 dark:text-brand-300 font-semibold">{recipe.title}</span>. Plate your masterpiece and enjoy!
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStepIndex(0);
                    setIsCompleted(false);
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 text-sm font-semibold transition-colors"
                >
                  Review Steps
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-lg shadow-brand-600/30 transition-all"
                >
                  Back to Recipes
                </button>
              </div>
            </div>
          )}

          {/* Bottom Step Navigation Bar */}
          {!isCompleted && (
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-200 text-sm font-semibold disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500">
                <span>Navigate with</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[10px]">&larr;</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[10px]">&rarr;</kbd>
                <span>Space for timer</span>
              </div>

              {currentStepIndex < recipe.steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-600/30 transition-all active:scale-98"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCompleted(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md shadow-emerald-600/30 transition-all active:scale-98"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Finish Recipe</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Ingredients Sidebar Overlay / Drawer */}
        {showIngredients && (
          <aside className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-6 flex flex-col overflow-y-auto animate-fadeIn absolute right-0 inset-y-0 z-10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <h4 className="font-bold font-display text-zinc-900 dark:text-white text-base">
                Ingredients List
              </h4>
              <button
                type="button"
                onClick={() => setShowIngredients(false)}
                className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick unit switch */}
            <div className="py-2.5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Units:</span>
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUnitSystem('us')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    unitSystem === 'us'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500'
                  }`}
                >
                  US
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    unitSystem === 'metric'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500'
                  }`}
                >
                  Metric
                </button>
              </div>
            </div>

            <div className="py-4 space-y-2.5 flex-1 overflow-y-auto">
              {recipe.ingredients.map((ing) => {
                const converted = convertIngredientUnit(ing.amount, ing.unit, unitSystem);
                return (
                  <div key={ing.id} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 dark:bg-zinc-800/60 dark:border-zinc-700/50 text-xs">
                    <span className="font-bold text-brand-600 dark:text-brand-400">
                      {converted.formatted}
                    </span>{' '}
                    <span className="text-zinc-800 dark:text-zinc-200">{ing.name}</span>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
