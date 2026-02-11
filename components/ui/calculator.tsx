"use client";

import * as React from "react";
import { Calculator as CalculatorIcon, X, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

export function Calculator() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [display, setDisplay] = React.useState("0");
    const [equation, setEquation] = React.useState("");
    const [isNewNumber, setIsNewNumber] = React.useState(true);
    const [isScientific, setIsScientific] = React.useState(false);

    const handleNumber = (num: string) => {
        if (isNewNumber) {
            setDisplay(num);
            setIsNewNumber(false);
        } else {
            setDisplay(display === "0" ? num : display + num);
        }
    };

    const handleOperator = (op: string) => {
        if (isNewNumber && equation !== "") {
            // If replacing operator
            const trimmed = equation.trim();
            if ("+-*/".includes(trimmed[trimmed.length - 1])) {
                setEquation(trimmed.slice(0, -1) + " " + op + " ");
                return;
            }
        }
        setEquation(equation + display + " " + op + " ");
        setIsNewNumber(true);
    };

    const handlePercentage = () => {
        const current = parseFloat(display);
        if (equation.trim().endsWith("+") || equation.trim().endsWith("-")) {
            // Percentage of base
            const parts = equation.trim().split(" ");
            // Last part is op, prev is number?
            // equation is like "56 - "
            const baseStr = parts[parts.length - 2];
            const base = parseFloat(baseStr);
            if (!isNaN(base)) {
                const val = (base * current) / 100;
                setDisplay(String(val));
                setIsNewNumber(true); // Treat as result? No, usually treat as input.
                // If I set isNewNumber=true, typing next number clears it.
                // But here we computed a value.
                // If user presses =, it uses this value.
                // If user types number, it replaces this value.
                // So setIsNewNumber(true) is correct for "result behavior" but usually after %, you press = or operator.
                return;
            }
        }
        // Default
        const val = current / 100;
        setDisplay(String(val));
    };

    const handleScientific = (func: string) => {
        if (isNewNumber) {
            setDisplay(func + "(");
            setIsNewNumber(false);
        } else {
            setDisplay(display + func + "(");
        }
    };

    const calculate = () => {
        try {
            let expression = equation + display;

            // Percentage regex not needed if we handle % button explicitly.
            // But let's keep basic cleanup just in case.

            // Sanitize
            expression = expression
                .replace(/sin/g, "Math.sin")
                .replace(/cos/g, "Math.cos")
                .replace(/tan/g, "Math.tan")
                .replace(/log/g, "Math.log10")
                .replace(/ln/g, "Math.log")
                .replace(/sqrt/g, "Math.sqrt")
                .replace(/π/g, "Math.PI")
                .replace(/e/g, "Math.E")
                .replace(/\^/g, "**");

            // Evaluate
            // Note: eval might fail if equation ends with operator?
            // "56 - " + "2.8" = "56 - 2.8". Works.

            const result = eval(expression);
            const rounded = Math.round(result * 10000000000) / 10000000000;

            setDisplay(String(rounded));
            setEquation("");
            setIsNewNumber(true);
        } catch (e) {
            console.error(e);
            setDisplay("Error");
            setIsNewNumber(true);
        }
    };

    const clear = () => {
        setDisplay("0");
        setEquation("");
        setIsNewNumber(true);
    };

    // Keyboard support
    React.useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;

            if (/[0-9]/.test(key)) {
                handleNumber(key);
            } else if (key === ".") {
                handleNumber(".");
            } else if (key === "+" || key === "-" || key === "*" || key === "/" || key === "(" || key === ")") {
                handleOperator(key);
            } else if (key === "%") {
                handlePercentage();
            } else if (key === "Enter" || key === "=") {
                e.preventDefault();
                calculate();
            } else if (key === "Backspace") {
                setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
            } else if (key === "Escape") {
                setIsOpen(false);
            } else if (key === "c" || key === "C") {
                clear();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, display, equation, isNewNumber]); // Dependencies need to be updated or use functional updates to avoid stale closures.
    // Actually, handling handlers might be better if they use functional state updates.
    // Let's verify handleNumber/handleOperator logic for stale state.
    // handleNumber uses `display` state directly: `setDisplay(display === "0" ? num : display + num)`
    // If useEffect runs on every display change, it's fine.


    if (!isOpen) {
        return (
            <Button
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50 bg-[#FF851B] hover:bg-[#FF851B]/90 text-white border-4 border-white"
                onClick={() => setIsOpen(true)}
            >
                <CalculatorIcon className="h-8 w-8" />
            </Button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in">
            <Card className={`shadow-pos-xl border-primary-100 bg-white overflow-hidden transition-all duration-300 ${isScientific ? 'w-96' : 'w-72'}`}>
                {/* Header */}
                <div className="bg-[#001f3f] p-3 flex items-center justify-between text-white border-b-4 border-[#FF851B]">
                    <div className="flex items-center gap-2">
                        <CalculatorIcon className="h-5 w-5 text-[#FF851B]" />
                        <span className="font-bold text-sm tracking-wide">LEKHYA CALC</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-white hover:bg-[#FF851B] hover:text-white px-2 rounded-none"
                            onClick={() => setIsScientific(!isScientific)}
                        >
                            {isScientific ? "Basic" : "Sci"}
                        </Button>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-red-600 text-white p-1 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Display */}
                <div className="p-4 bg-gray-50 border-b">
                    <div className="text-xs text-gray-500 text-right h-5 truncate">{equation}</div>
                    <div className="text-2xl font-bold text-gray-900 text-right truncate">
                        {display}
                    </div>
                </div>

                {/* Keypad */}
                <div className={`p-2 grid gap-2 ${isScientific ? 'grid-cols-5' : 'grid-cols-4'}`}>
                    <Button variant="outline" onClick={clear} className="text-red-500 font-bold col-span-1">C</Button>
                    <Button variant="outline" onClick={() => setDisplay(display.slice(0, -1) || "0")}>
                        <Delete className="h-4 w-4" />
                    </Button>
                    {isScientific && <Button variant="navy" onClick={() => handleScientific("sin")} className="text-xs">sin</Button>}
                    <Button variant="outline" onClick={handlePercentage}>%</Button>
                    <Button variant="outline" onClick={() => handleOperator("/")}>÷</Button>

                    {isScientific && <Button variant="navy" onClick={() => handleScientific("cos")} className="text-xs">cos</Button>}
                    <Button variant="ghost" onClick={() => handleNumber("7")} className="font-semibold text-lg hover:bg-gray-100">7</Button>
                    <Button variant="ghost" onClick={() => handleNumber("8")} className="font-semibold text-lg hover:bg-gray-100">8</Button>
                    <Button variant="ghost" onClick={() => handleNumber("9")} className="font-semibold text-lg hover:bg-gray-100">9</Button>
                    <Button variant="outline" onClick={() => handleOperator("*")}>×</Button>

                    {isScientific && <Button variant="navy" onClick={() => handleScientific("tan")} className="text-xs">tan</Button>}
                    <Button variant="ghost" onClick={() => handleNumber("4")} className="font-semibold text-lg hover:bg-gray-100">4</Button>
                    <Button variant="ghost" onClick={() => handleNumber("5")} className="font-semibold text-lg hover:bg-gray-100">5</Button>
                    <Button variant="ghost" onClick={() => handleNumber("6")} className="font-semibold text-lg hover:bg-gray-100">6</Button>
                    <Button variant="outline" onClick={() => handleOperator("-")}>-</Button>

                    {isScientific && <Button variant="navy" onClick={() => handleScientific("sqrt")} className="text-xs">√</Button>}
                    <Button variant="ghost" onClick={() => handleNumber("1")} className="font-semibold text-lg hover:bg-gray-100">1</Button>
                    <Button variant="ghost" onClick={() => handleNumber("2")} className="font-semibold text-lg hover:bg-gray-100">2</Button>
                    <Button variant="ghost" onClick={() => handleNumber("3")} className="font-semibold text-lg hover:bg-gray-100">3</Button>
                    <Button variant="outline" onClick={() => handleOperator("+")}>+</Button>

                    {isScientific && <Button variant="navy" onClick={() => handleOperator("^")} className="text-xs">^</Button>}
                    <Button variant="ghost" onClick={() => handleNumber("0")} className={`font-semibold text-lg hover:bg-gray-100 ${isScientific ? '' : 'col-span-2'}`}>0</Button>
                    <Button variant="ghost" onClick={() => handleNumber(".")}>.</Button>
                    {isScientific && <Button variant="navy" onClick={() => handleNumber("(")}>(</Button>}
                    {isScientific && <Button variant="navy" onClick={() => handleNumber(")")}>)</Button>}
                    <Button className="bg-primary-600 hover:bg-primary-700 text-white col-span-1" onClick={calculate}>=</Button>
                </div>
            </Card>
        </div>
    );
}
