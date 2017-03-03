(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(WorkService, $window, StudentService, FlashService) {
        var vm = this;

        vm.work;
        vm.student = null;
        vm.saveWork = saveWork;

        initController();

        function initController() {
            // get current student
            StudentService.GetCurrent().then(function (student) {
                vm.student = student;
            });
        }

        function saveWork() {
            WorkService.Create(vm.student,vm.work)
                .then(function () {
                    FlashService.Success('work added');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();