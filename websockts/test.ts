/*
 * @Description:
 * @Version: 1.0
 * @Autor: wangmiao
 * @Date: 2020-05-26 11:38:12
 * @LastEditors: wangmiao
 * @LastEditTime: 2020-05-26 12:18:10
 */ 
import { assertStrictEq } from "https://deno.land/std/testing/asserts.ts";
import { camelize } from "./camelize.ts";

Deno.test("camelize works", async () => {
  assertStrictEq(camelize("this is an example"), "thisIsAnExample 🐪🐪🐪");
});