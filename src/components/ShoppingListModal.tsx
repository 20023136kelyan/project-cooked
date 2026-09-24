import React, { useState } from 'react';
import { ShoppingItem, IngredientAisle } from '../types/recipe';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Check, 
  Plus, 
  Copy, 
  CheckCheck, 
  Sparkles,
  Apple,
  Milk,
  Beef,
  Package,
  Flame,
  HelpCircle
} from 'lucide-react';
import { formatIngredientAmount } from '../utils/format';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
  onAddCustomItem: (name: string, amount: number, unit: string, category: IngredientAisle) => void;
}

const AISLE_ICONS: Record<IngredientAisle, React.FC<{ className?: string }>> = {
  'Produce': Apple,
  'Dairy & Eggs': Milk,
  'Meat & Seafood': Beef,
  'Pantry': Package,
  'Spices': Flame,
  'Other': HelpCircle,
};

const AISLE_ORDER: IngredientAisle[] = [
  'Produce',
  'Dairy & Eggs',
  'Meat & Seafood',
  'Pantry',
  'Spices',
  'Other',
];

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  items,
  onToggleItem,
  onRemoveItem,
  onClearChecked,
  onClearAll,
  onAddCustomItem,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState<number>(1);
  const [newItemUnit, setNewItemUnit] = useState('item');
  const [newItemCategory, setNewItemCategory] = useState<IngredientAisle>('Produce');

  const checkedCount = items.filter((i) => i.checked).length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddCustomItem(newItemName, newItemAmount, newItemUnit, newItemCategory);
    setNewItemName('');
    setNewItemAmount(1);
    setNewItemUnit('item');
  };

  const handleCopyList = () => {
    if (items.length === 0) return;

    let text = '🛒 Project Cooked Grocery List:\n\n';
    AISLE_ORDER.forEach((aisle) => {
      const aisleItems = items.filter((i) => i.category === aisle);
      if (aisleItems.length > 0) {
        text += `[${aisle.toUpperCase()}]\n`;
        aisleItems.forEach((item) => {
          const status = item.checked ? '✓' : '•';
          const amt = formatIngredientAmount(item.amount);
          text += `  ${status} ${amt} ${item.unit} ${item.name}${item.recipeTitle ? ` (for ${item.recipeTitle})` : ''}\n`;
        });
        text += '\n';
      }
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-white">
                  Grocery &amp; Shopping List
                </h2>
                {items.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 font-semibold">
                    {checkedCount}/{items.length} done
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Organized by supermarket aisle for effortless grocery trips.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAddItem} className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Add grocery item (e.g. Olive oil, Basil)..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 min-w-[180px] px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0.1"
              step="any"
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(Number(e.target.value))}
              className="w-16 px-2.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              title="Quantity"
            />
            <input
              type="text"
              placeholder="unit"
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              className="w-16 px-2.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as IngredientAisle)}
            className="px-2.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {AISLE_ORDER.map((aisle) => (
              <option key={aisle} value={aisle}>
                {aisle}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="py-12 text-center max-w-sm mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-zinc-800 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white">
                Your grocery list is empty
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Add ingredients directly from any recipe card or use the quick bar above to jot down extra items you need.
              </p>
            </div>
          ) : (
            AISLE_ORDER.map((aisle) => {
              const aisleItems = items.filter((i) => i.category === aisle);
              if (aisleItems.length === 0) return null;
              const Icon = AISLE_ICONS[aisle] || HelpCircle;

              return (
                <div key={aisle} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5 text-brand-500" />
                    <span>{aisle}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 font-medium">
                      {aisleItems.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {aisleItems.map((item) => {
                      const formattedAmt = formatIngredientAmount(item.amount);

                      return (
                        <div
                          key={item.id}
                          onClick={() => onToggleItem(item.id)}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                            item.checked
                              ? 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 opacity-60'
                              : 'bg-white dark:bg-zinc-800/80 border-zinc-200/80 dark:border-zinc-700/80 hover:border-brand-300 dark:hover:border-brand-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                                item.checked
                                  ? 'bg-brand-600 border-brand-600 text-white'
                                  : 'border-zinc-300 dark:border-zinc-600'
                              }`}
                            >
                              {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>

                            <div>
                              <p className={`text-sm font-semibold text-zinc-900 dark:text-zinc-100 ${
                                item.checked ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
                              }`}>
                                {formattedAmt && `${formattedAmt} `}{item.unit} {item.name}
                              </p>
                              {item.recipeTitle && (
                                <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                                  for {item.recipeTitle}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveItem(item.id);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyList}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-sm"
              >
                {copied ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted List'}</span>
              </button>

              {checkedCount > 0 && (
                <button
                  type="button"
                  onClick={onClearChecked}
                  className="px-3 py-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 text-xs font-medium transition-colors"
                >
                  Clear Checked ({checkedCount})
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire grocery list?')) {
                  onClearAll();
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-500 px-3 py-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
