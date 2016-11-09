/*! grafana - v3.1.1-1470047149 - 2016-08-01
 * Copyright (c) 2016 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["test/lib/common","app/features/dashboard/dashboardSrv","../dynamic_dashboard_srv"],function(a){function b(a,b){c.describe(a,function(){var a={};a.setup=function(b){c.beforeEach(c.angularMocks.module("grafana.services")),c.beforeEach(c.angularMocks.module(function(a){a.value("contextSrv",{user:{timezone:"utc"}})})),c.beforeEach(c.angularMocks.inject(function(c){a.dashboardSrv=c;var e={rows:[],templating:{list:[]}};b(e),a.dash=a.dashboardSrv.create(e),a.dynamicDashboardSrv=new d.DynamicDashboardSrv,a.dynamicDashboardSrv.init(a.dash),a.rows=a.dash.rows}))},b(a)})}var c,d;return{setters:[function(a){c=a},function(a){},function(a){d=a}],execute:function(){b("given dashboard with panel repeat",function(a){a.setup(function(a){a.rows.push({panels:[{id:2,repeat:"apps"}]}),a.templating.list.push({name:"apps",current:{text:"se1, se2, se3",value:["se1","se2","se3"]},options:[{text:"se1",value:"se1",selected:!0},{text:"se2",value:"se2",selected:!0},{text:"se3",value:"se3",selected:!0},{text:"se4",value:"se4",selected:!1}]})}),c.it("should repeat panel one time",function(){c.expect(a.rows[0].panels.length).to.be(3)}),c.it("should mark panel repeated",function(){c.expect(a.rows[0].panels[0].repeat).to.be("apps"),c.expect(a.rows[0].panels[1].repeatPanelId).to.be(2)}),c.it("should set scopedVars on panels",function(){c.expect(a.rows[0].panels[0].scopedVars.apps.value).to.be("se1"),c.expect(a.rows[0].panels[1].scopedVars.apps.value).to.be("se2"),c.expect(a.rows[0].panels[2].scopedVars.apps.value).to.be("se3")}),c.describe("After a second iteration",function(){var b;c.beforeEach(function(){b=a.rows[0].panels[1],a.rows[0].panels[0].fill=10,a.dynamicDashboardSrv.update(a.dash)}),c.it("should have reused same panel instances",function(){c.expect(a.rows[0].panels[1]).to.be(b)}),c.it("reused panel should copy properties from source",function(){c.expect(a.rows[0].panels[1].fill).to.be(10)}),c.it("should have same panel count",function(){c.expect(a.rows[0].panels.length).to.be(3)})}),c.describe("After a second iteration and selected values reduced",function(){c.beforeEach(function(){a.dash.templating.list[0].options[1].selected=!1,a.dynamicDashboardSrv.update(a.dash)}),c.it("should clean up repeated panel",function(){c.expect(a.rows[0].panels.length).to.be(2)})}),c.describe("After a second iteration and panel repeat is turned off",function(){c.beforeEach(function(){a.rows[0].panels[0].repeat=null,a.dynamicDashboardSrv.update(a.dash)}),c.it("should clean up repeated panel",function(){c.expect(a.rows[0].panels.length).to.be(1)}),c.it("should remove scoped vars from reused panel",function(){c.expect(a.rows[0].panels[0].scopedVars).to.be.empty()})})}),b("given dashboard with row repeat",function(a){a.setup(function(a){a.rows.push({repeat:"servers",panels:[{id:2}]}),a.rows.push({panels:[]}),a.templating.list.push({name:"servers",current:{text:"se1, se2",value:["se1","se2"]},options:[{text:"se1",value:"se1",selected:!0},{text:"se2",value:"se2",selected:!0}]})}),c.it("should repeat row one time",function(){c.expect(a.rows.length).to.be(3)}),c.it("should keep panel ids on first row",function(){c.expect(a.rows[0].panels[0].id).to.be(2)}),c.it("should keep first row as repeat",function(){c.expect(a.rows[0].repeat).to.be("servers")}),c.it("should clear repeat field on repeated row",function(){c.expect(a.rows[1].repeat).to.be(null)}),c.it("should add scopedVars to rows",function(){c.expect(a.rows[0].scopedVars.servers.value).to.be("se1"),c.expect(a.rows[1].scopedVars.servers.value).to.be("se2")}),c.it("should generate a repeartRowId based on repeat row index",function(){c.expect(a.rows[1].repeatRowId).to.be(1)}),c.it("should set scopedVars on row panels",function(){c.expect(a.rows[0].panels[0].scopedVars.servers.value).to.be("se1"),c.expect(a.rows[1].panels[0].scopedVars.servers.value).to.be("se2")}),c.describe("After a second iteration",function(){var b;c.beforeEach(function(){b=a.rows[1],a.rows[0].height=500,a.dynamicDashboardSrv.update(a.dash)}),c.it("should still only have 2 rows",function(){c.expect(a.rows.length).to.be(3)}),c.it.skip("should have updated props from source",function(){c.expect(a.rows[1].height).to.be(500)}),c.it("should reuse row instance",function(){c.expect(a.rows[1]).to.be(b)})}),c.describe("After a second iteration and selected values reduced",function(){c.beforeEach(function(){a.dash.templating.list[0].options[1].selected=!1,a.dynamicDashboardSrv.update(a.dash)}),c.it("should remove repeated second row",function(){c.expect(a.rows.length).to.be(2)})})}),b("given dashboard with row repeat and panel repeat",function(a){a.setup(function(a){a.rows.push({repeat:"servers",panels:[{id:2,repeat:"metric"}]}),a.templating.list.push({name:"servers",current:{text:"se1, se2",value:["se1","se2"]},options:[{text:"se1",value:"se1",selected:!0},{text:"se2",value:"se2",selected:!0}]}),a.templating.list.push({name:"metric",current:{text:"m1, m2",value:["m1","m2"]},options:[{text:"m1",value:"m1",selected:!0},{text:"m2",value:"m2",selected:!0}]})}),c.it("should repeat row one time",function(){c.expect(a.rows.length).to.be(2)}),c.it("should repeat panel on both rows",function(){c.expect(a.rows[0].panels.length).to.be(2),c.expect(a.rows[1].panels.length).to.be(2)}),c.it("should keep panel ids on first row",function(){c.expect(a.rows[0].panels[0].id).to.be(2)}),c.it("should mark second row as repeated",function(){c.expect(a.rows[0].repeat).to.be("servers")}),c.it("should clear repeat field on repeated row",function(){c.expect(a.rows[1].repeat).to.be(null)}),c.it("should generate a repeartRowId based on repeat row index",function(){c.expect(a.rows[1].repeatRowId).to.be(1)}),c.it("should set scopedVars on row panels",function(){c.expect(a.rows[0].panels[0].scopedVars.servers.value).to.be("se1"),c.expect(a.rows[1].panels[0].scopedVars.servers.value).to.be("se2")})})}}});