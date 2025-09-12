"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
var ssr_1 = require("@supabase/ssr");
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
var createClient = function () { return (0, ssr_1.createBrowserClient)(supabaseUrl, supabaseKey); };
exports.createClient = createClient;
