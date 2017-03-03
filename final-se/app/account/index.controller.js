(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, StudentService, FlashService) {
        var vm = this;

        vm.student = null;
        vm.saveStudent = saveStudent;
        vm.deleteStudent = deleteStudent;

        initController();

        function initController() {
            // get current student
            StudentService.GetCurrent().then(function (student) {
                vm.student = student;
            });
        }

        function saveStudent() {
            StudentService.Update(vm.student)
                .then(function () {
                    FlashService.Success('Student updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteStudent() {
            StudentService.Delete(vm.student._id)
                .then(function () {
                    // log student out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();