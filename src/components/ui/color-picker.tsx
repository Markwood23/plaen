"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange?: (color: string) => void;
  label?: string;
  description?: string;
}

export function ColorPicker({ value, onChange, label, description }: ColorPickerProps) {
  const [color, setColor] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      handleColorChange(newColor);
    }
  };

  return (
    <div>
      {label && (
        <label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-12 w-12 rounded-full border-2 cursor-pointer transition-all hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              style={{ 
                backgroundColor: color, 
                borderColor: "#E4E6EB"
              }}
              aria-label="Pick a color"
            />
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-4 rounded-2xl border-0" 
            style={{ backgroundColor: 'white', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)' }}
            sideOffset={8}
          >
            <div className="space-y-4">
              <HexColorPicker color={color} onChange={handleColorChange} />
              <div className="flex items-center gap-2">
                <div 
                  className="h-8 w-8 rounded-full border-2 flex-shrink-0"
                  style={{ backgroundColor: color, borderColor: "#E4E6EB" }}
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  onBlur={handleInputChange}
                  className="h-9 rounded-lg border text-sm font-mono uppercase"
                  style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D", borderColor: "#E4E6EB" }}
                  placeholder="#000000"
                />
              </div>
              
              {/* Preset colors */}
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: "#949494" }}>
                  Quick Colors
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    "#14462a", // Primary Green
                    "#1a5a38", // Lighter Green
                    "#0f3520", // Darker Green
                    "#2D2D2D", // Black
                    "#65676B", // Gray
                    "#B0B3B8", // Light Gray
                    "#DC2626", // Error Red
                    "#F59E0B", // Warning Orange
                    "#0D9488", // Success Green
                    "#3B82F6", // Blue
                    "#8B5CF6", // Violet
                    "#EC4899", // Pink
                  ].map((presetColor) => (
                    <button
                      key={presetColor}
                      type="button"
                      className="h-8 w-8 rounded-full border-2 cursor-pointer transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ 
                        backgroundColor: presetColor, 
                        borderColor: color === presetColor ? "#2D2D2D" : "#E4E6EB",
                        borderWidth: color === presetColor ? "3px" : "2px"
                      }}
                      onClick={() => handleColorChange(presetColor)}
                      aria-label={`Select ${presetColor}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          onBlur={handleInputChange}
          className="h-11 rounded-full flex-1 border-0 font-mono uppercase"
          style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
          placeholder="#000000"
        />
      </div>
      {description && (
        <p className="text-sm mt-1.5" style={{ color: "#B0B3B8" }}>
          {description}
        </p>
      )}
    </div>
  );
}
